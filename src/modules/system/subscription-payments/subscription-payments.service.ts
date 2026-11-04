import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  OrgSubscriptionStatus,
  SysOrganization,
} from '../../../database/models/system/sys_organization.model';
import { SysPlan } from '../../../database/models/system/sys_plan.model';
import {
  SubscriptionPaymentStatus,
  SysSubscriptionPayment,
} from '../../../database/models/system/sys_subscription_payment.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import {
  InitiateSubscriptionPaymentDto,
  PaymentBillingCycle,
} from './dto/initiate-subscription-payment.dto';
import { QuerySubscriptionPaymentsDto } from './dto/query-subscription-payments.dto';
import { SslcommerzService } from './sslcommerz.service';

@Injectable()
export class SubscriptionPaymentsService implements OnModuleInit {
  private readonly logger = new Logger(SubscriptionPaymentsService.name);

  constructor(
    @InjectModel(SysSubscriptionPayment)
    private paymentModel: typeof SysSubscriptionPayment,
    @InjectModel(SysOrganization)
    private orgModel: typeof SysOrganization,
    @InjectModel(SysPlan)
    private planModel: typeof SysPlan,
    @InjectModel(SysUser)
    private userModel: typeof SysUser,
    private readonly sslcommerzService: SslcommerzService,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {}

  async onModuleInit() {
    try {
      await this.paymentModel.sync({ alter: false });
    } catch (err: any) {
      this.logger.warn(`Could not sync SysSubscriptionPayment: ${err?.message}`);
    }
  }

  async initiateCheckout(
    requestingUser: any,
    dto: InitiateSubscriptionPaymentDto,
  ) {
    // 1. Resolve Organization
    let targetOrgId: number | null = null;

    if (dto.organizationId) {
      targetOrgId = Number(dto.organizationId);
    } else if (requestingUser?.orgId) {
      targetOrgId = Number(requestingUser.orgId);
    } else if (requestingUser?.id) {
      const user = await this.userModel.findByPk(requestingUser.id);
      if (user?.orgId) {
        targetOrgId = Number(user.orgId);
      }
    }

    if (!targetOrgId) {
      const firstOrg = await this.orgModel.findOne();
      if (firstOrg) {
        targetOrgId = Number(firstOrg.id);
      } else {
        throw new BadRequestException(
          'No organization found for subscription billing',
        );
      }
    }

    const org = await this.orgModel.findByPk(targetOrgId);
    if (!org) {
      throw new NotFoundException(`Organization ID ${targetOrgId} not found`);
    }

    // 2. Resolve Plan
    const plan = await this.planModel.findByPk(dto.planId);
    if (!plan) {
      throw new NotFoundException(`Subscription plan ID ${dto.planId} not found`);
    }

    // 3. Compute Price & Duration in Days
    let amount = 0;
    let durationDays = 30;

    switch (dto.billingCycle) {
      case PaymentBillingCycle.YEARLY:
        amount = Number(plan.yearlyPrice || plan.monthlyPrice * 12 * 0.8);
        durationDays = 365;
        break;
      case PaymentBillingCycle.HALF_YEARLY:
        amount = Number(plan.monthlyPrice * 6 * 0.9);
        durationDays = 180;
        break;
      case PaymentBillingCycle.QUARTERLY:
        amount = Number(plan.monthlyPrice * 3 * 0.95);
        durationDays = 90;
        break;
      case PaymentBillingCycle.MONTHLY:
      default:
        amount = Number(plan.monthlyPrice);
        durationDays = Number(plan.durationDays || 30);
        break;
    }

    // Guarantee non zero amount for testing
    if (isNaN(amount) || amount <= 0) {
      amount = 100.0;
    }

    // 4. Generate Unique Transaction ID
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const tranId = `RB_${Date.now()}_${randomSuffix}`;

    // 5. Create Pending Transaction Record
    const paymentRecord = await this.paymentModel.create({
      organizationId: Number(org.id),
      planId: Number(plan.id),
      userId: Number(requestingUser?.id || 1),
      tranId,
      amount,
      currency: 'BDT',
      billingCycle: dto.billingCycle,
      durationDays,
      status: SubscriptionPaymentStatus.PENDING,
      paymentInitiatedAt: new Date(),
    });

    // 6. Build Backend Callback URLs
    const backendDomain =
      this.configService.get<string>('BACKEND_DOMAIN') || 'http://localhost';
    const port = this.configService.get<number>('PORT') || 5002;
    const apiPrefix = 'realbizpro/api/v1';
    const callbackBase = `${backendDomain}:${port}/${apiPrefix}/subscription-payments`;

    const successUrl = `${callbackBase}/success`;
    const failUrl = `${callbackBase}/fail`;
    const cancelUrl = `${callbackBase}/cancel`;
    const ipnUrl = `${callbackBase}/ipn`;

    // 7. Request Session from SSLCommerz
    const sessionRes = await this.sslcommerzService.initiatePaymentSession({
      totalAmount: amount,
      currency: 'BDT',
      tranId,
      successUrl,
      failUrl,
      cancelUrl,
      ipnUrl,
      customerName: requestingUser?.name || org.name || 'Tenant Admin',
      customerEmail: requestingUser?.email || org.email || 'billing@realbizpro.com',
      customerPhone: requestingUser?.phone || org.phone || '01700000000',
      customerAddress: org.address || 'Dhaka, Bangladesh',
      customerCity: 'Dhaka',
      productName: `${plan.name} (${dto.billingCycle})`,
      productCategory: 'Subscription',
    });

    if (sessionRes.status !== 'SUCCESS' || !sessionRes.gatewayUrl) {
      paymentRecord.status = SubscriptionPaymentStatus.FAILED;
      paymentRecord.gatewayResponse = sessionRes;
      await paymentRecord.save();
      throw new BadRequestException(
        sessionRes.failedreason || 'Failed to initiate gateway payment session',
      );
    }

    return {
      success: true,
      gatewayUrl: sessionRes.gatewayUrl,
      tranId,
      amount,
      currency: 'BDT',
      planName: plan.name,
      billingCycle: dto.billingCycle,
    };
  }

  async processPaymentSuccess(payload: any, isIpn: boolean = false) {
    const tranId = payload.tran_id;
    const valId = payload.val_id;

    if (!tranId) {
      throw new BadRequestException('Transaction identifier tran_id is missing');
    }

    this.logger.log(
      `Processing payment success callback for tran_id: ${tranId}, val_id: ${valId}, isIpn: ${isIpn}`,
    );

    // 1. Locate Pending Payment Record
    const payment = await this.paymentModel.findOne({
      where: { tranId },
    });

    if (!payment) {
      throw new NotFoundException(`Transaction ${tranId} not found`);
    }

    // 2. Strict Idempotency Check
    if (payment.status === SubscriptionPaymentStatus.VALID) {
      this.logger.log(
        `Transaction ${tranId} already verified and marked VALID. Skipping duplicate activation.`,
      );
      return { success: true, message: 'Payment already processed', payment };
    }

    // 3. Outbound Order Validation Check with SSLCommerz API
    if (!valId) {
      throw new BadRequestException('Missing validation identifier val_id');
    }

    const validation = await this.sslcommerzService.validateTransaction(valId);
    this.logger.log(`SSLCommerz Validation API returned: ${JSON.stringify(validation)}`);

    const isValidStatus =
      validation.status === 'VALID' || validation.status === 'VALIDATED';

    if (!isValidStatus) {
      payment.status = SubscriptionPaymentStatus.FAILED;
      payment.gatewayResponse = validation;
      await payment.save();
      throw new BadRequestException(
        `Validation API rejected transaction: status=${validation.status}`,
      );
    }

    // Verify amount and currency
    const verifiedAmount = Number(validation.amount);
    const expectedAmount = Number(payment.amount);
    if (Math.abs(verifiedAmount - expectedAmount) > 1.0) {
      this.logger.error(
        `Amount mismatch! Expected: ${expectedAmount}, Received: ${verifiedAmount}`,
      );
      payment.status = SubscriptionPaymentStatus.FAILED;
      payment.gatewayResponse = validation;
      await payment.save();
      throw new BadRequestException('Payment amount mismatch detected');
    }

    // 4. Atomically Update Payment & Extend Subscription within Transaction
    const dbTransaction = await this.sequelize.transaction();

    try {
      payment.status = SubscriptionPaymentStatus.VALID;
      payment.valId = valId;
      payment.bankTranId = validation.bank_tran_id || payload.bank_tran_id;
      payment.cardType = validation.card_type || payload.card_type;
      payment.cardBrand = validation.card_brand || payload.card_brand;
      payment.gatewayResponse = validation;
      payment.paymentCompletedAt = new Date();
      await payment.save({ transaction: dbTransaction });

      const org = await this.orgModel.findByPk(payment.organizationId, {
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE,
      });

      if (org) {
        const plan = await this.planModel.findByPk(payment.planId, {
          transaction: dbTransaction,
        });

        const now = new Date();
        const currentEnd =
          org.subscriptionEndDate && org.subscriptionEndDate > now
            ? new Date(org.subscriptionEndDate)
            : now;

        const newEnd = new Date(
          currentEnd.getTime() + payment.durationDays * 24 * 60 * 60 * 1000,
        );

        org.planId = payment.planId;
        org.planUuid = plan?.uuid || org.planUuid;
        org.subscriptionStatus = OrgSubscriptionStatus.ACTIVE;
        org.subscriptionStartDate = org.subscriptionStartDate || now;
        org.subscriptionEndDate = newEnd;

        if (plan) {
          if (plan.maxUsers) org.maxUsers = plan.maxUsers;
          if (plan.maxProjects) org.maxProjects = plan.maxProjects;
          if (plan.maxStorageMb) org.maxStorageMb = plan.maxStorageMb;
        }

        await org.save({ transaction: dbTransaction });
      }

      await dbTransaction.commit();
      this.logger.log(
        `Successfully activated subscription for Org ${payment.organizationId} on TXN ${tranId}`,
      );

      return { success: true, message: 'Subscription successfully activated', payment };
    } catch (err: any) {
      await dbTransaction.rollback();
      this.logger.error(
        `Error updating subscription for TXN ${tranId}: ${err?.message}`,
        err?.stack,
      );
      throw err;
    }
  }

  async processPaymentFail(payload: any) {
    const tranId = payload.tran_id;
    this.logger.warn(`Payment failed callback received for ${tranId}`);

    if (tranId) {
      const payment = await this.paymentModel.findOne({ where: { tranId } });
      if (payment && payment.status === SubscriptionPaymentStatus.PENDING) {
        payment.status = SubscriptionPaymentStatus.FAILED;
        payment.gatewayResponse = payload;
        await payment.save();
      }
    }
    return { success: false, message: 'Payment marked as failed', payload };
  }

  async processPaymentCancel(payload: any) {
    const tranId = payload.tran_id;
    this.logger.warn(`Payment cancel callback received for ${tranId}`);

    if (tranId) {
      const payment = await this.paymentModel.findOne({ where: { tranId } });
      if (payment && payment.status === SubscriptionPaymentStatus.PENDING) {
        payment.status = SubscriptionPaymentStatus.CANCELLED;
        payment.gatewayResponse = payload;
        await payment.save();
      }
    }
    return { success: false, message: 'Payment marked as cancelled', payload };
  }

  async getHistory(
    query: QuerySubscriptionPaymentsDto,
    user: any,
  ): Promise<[SysSubscriptionPayment[], number]> {
    const { page = 1, limit = 20, status, search, organizationId } = query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (organizationId) {
      where.organizationId = organizationId;
    } else if (user?.orgId) {
      where.organizationId = user.orgId;
    }

    if (search) {
      where[Op.or] = [
        { tranId: { [Op.iLike]: `%${search}%` } },
        { bankTranId: { [Op.iLike]: `%${search}%` } },
        { valId: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.paymentModel.findAndCountAll({
      where,
      include: [
        {
          association: 'plan',
          attributes: ['id', 'name', 'code', 'monthlyPrice', 'yearlyPrice'],
          required: false,
        },
        {
          association: 'organization',
          attributes: ['id', 'name', 'code', 'subscriptionStatus', 'subscriptionEndDate'],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      offset: (page - 1) * limit,
      limit,
    });

    return [rows, count];
  }

  async expireStalePendingPayments() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const [updatedCount] = await this.paymentModel.update(
      { status: SubscriptionPaymentStatus.EXPIRED },
      {
        where: {
          status: SubscriptionPaymentStatus.PENDING,
          paymentInitiatedAt: { [Op.lt]: thirtyMinutesAgo },
        },
      },
    );
    if (updatedCount > 0) {
      this.logger.log(`Expired ${updatedCount} stale pending subscription payments`);
    }
    return updatedCount;
  }
}
