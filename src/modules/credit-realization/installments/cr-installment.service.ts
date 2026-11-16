import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../../database/models/credit-realization/cr_installment_payment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CreateCrPaymentDto, WaivePenaltyDto } from './dto/create-cr-payment.dto';

@Injectable()
export class CrInstallmentService {
  constructor(
    @InjectModel(CrInstallmentPlan)
    private readonly planModel: typeof CrInstallmentPlan,
    @InjectModel(CrInstallmentPayment)
    private readonly paymentModel: typeof CrInstallmentPayment,
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
  ) {}

  async getOverdueInstallments(orgId?: string) {
    const today = new Date().toISOString().split('T')[0];

    const overduePlans = await this.planModel.findAll({
      where: {
        due_date: { [Op.lt]: today },
        due_amount: { [Op.gt]: 0 },
        ...(orgId ? { org_id: orgId } : {}),
      },
      include: [{ model: this.agreementModel, as: 'sale_agreement' }],
      order: [['due_date', 'ASC']],
    });

    // Calculate live delay days and penalty
    const now = new Date();
    const updatedResults = await Promise.all(
      overduePlans.map(async (plan) => {
        const dueDate = new Date(plan.due_date);
        const diffMs = now.getTime() - dueDate.getTime();
        const delayDays = isNaN(diffMs) ? 0 : Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

        // Penalty formula: 0.05% per day on remaining due amount
        const dueAmount = Number(plan.due_amount) || 0;
        const penaltyRatePerDay = 0.0005; // 0.05% per day
        const rawPenalty = dueAmount * penaltyRatePerDay * delayDays;
        const waived = Number(plan.penalty_waived) || 0;
        const netPenalty = Math.max(0, rawPenalty - waived);
        const finalPenalty = isNaN(netPenalty) ? 0 : parseFloat(netPenalty.toFixed(2));

        await plan.update({
          delay_days: delayDays,
          penalty_amount: finalPenalty,
          status: 'overdue',
        });

        return plan;
      }),
    );

    return updatedResults;
  }

  async findOne(uuid: string, orgId?: string): Promise<CrInstallmentPlan> {
    const plan = await this.planModel.findOne({
      where: {
        uuid,
        ...(orgId ? { org_id: orgId } : {}),
      },
      include: [
        { model: this.paymentModel, as: 'payments' },
        { model: this.agreementModel, as: 'sale_agreement' },
      ],
    });
    if (!plan) throw new NotFoundException('Installment Plan not found');
    return plan;
  }

  async recordPayment(
    uuid: string,
    dto: CreateCrPaymentDto,
    orgId?: string,
    userEmail?: string,
  ) {
    const plan = await this.findOne(uuid, orgId);

    const paymentAmount = Number(dto.paid_amount);
    if (paymentAmount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }

    // Create payment entry
    const payment = await this.paymentModel.create({
      ...dto,
      installment_plan_id: plan.id,
      org_id: plan.org_id || orgId,
      ...(userEmail ? { createdBy: userEmail } : {}),
    } as any);

    // Update plan balances
    const currentPaid = Number(plan.paid_amount || 0);
    const newPaid = currentPaid + paymentAmount;
    const currentDue = Number(plan.payable_amount);
    const newDue = Math.max(0, currentDue - newPaid);

    const newStatus = newDue <= 0 ? 'paid' : 'partially_paid';

    await plan.update({
      paid_amount: parseFloat(newPaid.toFixed(2)),
      due_amount: parseFloat(newDue.toFixed(2)),
      status: newStatus,
      ...(userEmail ? { updatedBy: userEmail } : {}),
    });

    return {
      success: true,
      message: 'Payment recorded successfully',
      payment,
      updated_plan: await this.findOne(uuid, orgId),
    };
  }

  async waivePenalty(
    uuid: string,
    dto: WaivePenaltyDto,
    orgId?: string,
    userEmail?: string,
  ) {
    const plan = await this.findOne(uuid, orgId);

    const currentWaived = Number(plan.penalty_waived || 0);
    const newWaived = currentWaived + Number(dto.amount_to_waive);
    const currentPenalty = Number(plan.penalty_amount || 0);
    const netPenalty = Math.max(0, currentPenalty - Number(dto.amount_to_waive));

    await plan.update({
      penalty_waived: parseFloat(newWaived.toFixed(2)),
      penalty_amount: parseFloat(netPenalty.toFixed(2)),
      ...(userEmail ? { updatedBy: userEmail } : {}),
    });

    return {
      success: true,
      message: 'Penalty waived successfully',
      plan: await this.findOne(uuid, orgId),
    };
  }
}
