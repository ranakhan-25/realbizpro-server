import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrRecoveryLog } from '../../../database/models/credit-realization/cr_recovery_log.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import {
  CreateCrRecoveryLogDto,
  UpdateCrRecoveryLogDto,
} from './dto/create-cr-recovery.dto';

@Injectable()
export class CrRecoveryService {
  constructor(
    @InjectModel(CrRecoveryLog)
    private readonly recoveryModel: typeof CrRecoveryLog,
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
  ) {}

  async create(createDto: CreateCrRecoveryLogDto, orgId?: string, userEmail?: string) {
    let saleAgreementId = createDto.sale_agreement_id;
    if (saleAgreementId) {
      const existing = await this.agreementModel.findOne({
        where: {
          id: saleAgreementId,
          ...(orgId ? { org_id: orgId } : {}),
        },
      });
      if (!existing) {
        saleAgreementId = undefined;
      }
    }

    if (!saleAgreementId) {
      let agreement = await this.agreementModel.findOne({
        where: {
          ...(orgId ? { org_id: orgId } : {}),
        },
        order: [['id', 'ASC']],
      });
      if (!agreement) {
        agreement = await this.agreementModel.create({
          agreement_number: `AGR-${Date.now().toString().slice(-6)}`,
          customer_name: 'Customer Agreement',
          customer_phone: '+8801700000000',
          total_price: 5000000,
          down_payment: 1000000,
          status: 'active',
          ...(orgId ? { org_id: orgId } : {}),
          ...(userEmail ? { createdBy: userEmail } : {}),
        } as any);
      }
      saleAgreementId = Number(agreement.id);
    }

    const payload: any = {
      ...createDto,
      sale_agreement_id: saleAgreementId,
      action_type: createDto.action_type || 'phone_call',
      action_date: createDto.action_date ? new Date(createDto.action_date) : new Date(),
      officer_name: createDto.officer_name || 'Recovery Officer',
      outcome: createDto.outcome || createDto.outcome_status || 'in_progress',
      next_action_date: createDto.next_action_date || createDto.next_followup_date || null,
      customer_response: createDto.customer_response || createDto.remarks || null,
      ...(orgId ? { org_id: orgId } : {}),
      ...(userEmail ? { createdBy: userEmail } : {}),
    };

    return await this.recoveryModel.create(payload);
  }

  async findAll(orgId?: string) {
    return await this.recoveryModel.findAll({
      where: {
        ...(orgId ? { org_id: orgId } : {}),
      },
      include: [{ model: this.agreementModel, as: 'sale_agreement' }],
      order: [['action_date', 'DESC']],
    });
  }

  async findOne(uuid: string, orgId?: string) {
    const item = await this.recoveryModel.findOne({
      where: {
        uuid,
        ...(orgId ? { org_id: orgId } : {}),
      },
      include: [{ model: this.agreementModel, as: 'sale_agreement' }],
    });
    if (!item) throw new NotFoundException('Recovery log not found');
    return item;
  }

  async update(
    uuid: string,
    updateDto: UpdateCrRecoveryLogDto,
    orgId?: string,
    userEmail?: string,
  ) {
    const item = await this.findOne(uuid, orgId);
    const payload: any = { ...updateDto };

    if (updateDto.outcome || updateDto.outcome_status) {
      payload.outcome = updateDto.outcome || updateDto.outcome_status;
    }
    if (updateDto.next_action_date || updateDto.next_followup_date) {
      payload.next_action_date = updateDto.next_action_date || updateDto.next_followup_date;
    }
    if (updateDto.customer_response || updateDto.remarks) {
      payload.customer_response = updateDto.customer_response || updateDto.remarks;
    }
    if (userEmail) {
      payload.updatedBy = userEmail;
    }

    await item.update(payload);
    return item;
  }

  async remove(uuid: string, orgId?: string, userEmail?: string) {
    const item = await this.findOne(uuid, orgId);
    if (userEmail) {
      await item.update({ deletedBy: userEmail } as any);
    }
    await item.destroy();
    return { success: true, message: 'Recovery log deleted successfully' };
  }
}
