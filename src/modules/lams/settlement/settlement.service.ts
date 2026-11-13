import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LamsSettlement } from '../../../database/models/lams/settlement.model';
import { LamsSettlementPayment } from '../../../database/models/lams/settlement-payment.model';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { CreateSettlementPaymentDto } from './dto/create-settlement-payment.dto';

@Injectable()
export class SettlementService {
  constructor(
    @InjectModel(LamsSettlement)
    private readonly settlementModel: typeof LamsSettlement,
    @InjectModel(LamsSettlementPayment)
    private readonly paymentModel: typeof LamsSettlementPayment,
  ) {}

  async create(createDto: CreateSettlementDto, user?: any): Promise<LamsSettlement> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || createDto.org_id;
    if (!orgId) {
      throw new BadRequestException('Organization identifier (org_id) is mandatory');
    }

    const agreed = Number(createDto.agreed_amount || 0);
    const advance = Number(createDto.advance_amount || 0);
    const paid = Number(createDto.paid_amount || advance);
    const due = Math.max(0, agreed - paid);

    return await this.settlementModel.create({
      ...createDto,
      agreed_amount: agreed,
      advance_amount: advance,
      paid_amount: paid,
      due_amount: due,
      org_id: orgId,
      createdBy: user?.id?.toString() || user?.name,
    } as any);
  }

  async findAll(filter?: { lead_id?: string; org_id?: string }): Promise<LamsSettlement[]> {
    const where: any = {};
    if (filter?.lead_id) where.lead_id = filter.lead_id;
    if (filter?.org_id) where.org_id = filter.org_id;
    return await this.settlementModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string, orgId?: string): Promise<LamsSettlement> {
    const where: any = { uuid };
    if (orgId) where.org_id = orgId;
    const record = await this.settlementModel.findOne({ where });
    if (!record) throw new NotFoundException('Settlement record not found');
    return record;
  }

  async update(uuid: string, updateDto: UpdateSettlementDto, user?: any): Promise<LamsSettlement> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const record = await this.findOne(uuid, orgId);
    await record.update({
      ...updateDto,
      updatedBy: user?.id?.toString() || user?.name,
    } as any);
    return record;
  }

  async remove(uuid: string, user?: any): Promise<void> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const record = await this.findOne(uuid, orgId);
    await record.destroy();
  }

  async recordPayment(
    settlementUuid: string,
    dto: CreateSettlementPaymentDto,
    user?: any,
  ): Promise<LamsSettlementPayment> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const settlement = await this.findOne(settlementUuid, orgId);

    const paymentCount = await this.paymentModel.count({
      where: { settlement_id: settlement.uuid, org_id: settlement.org_id },
    });
    const paymentNo = `PAY-${new Date().getFullYear()}-${String(paymentCount + 1).padStart(4, '0')}`;

    const payment = await this.paymentModel.create({
      org_id: settlement.org_id,
      settlement_id: settlement.uuid,
      lead_id: settlement.lead_id,
      payment_no: paymentNo,
      installment_no: dto.installment_no || paymentCount + 1,
      amount: dto.amount,
      payment_date: dto.payment_date || new Date(),
      payment_method: dto.payment_method,
      reference_no: dto.reference_no,
      remarks: dto.remarks,
      receipt_url: dto.receipt_url,
      status: 'completed',
      createdBy: user?.id?.toString() || user?.name,
    } as any);

    const newPaid = Number(settlement.paid_amount || 0) + Number(dto.amount);
    const newDue = Math.max(0, Number(settlement.agreed_amount) - newPaid);
    const newStatus = newDue === 0 ? 'settled' : 'in_progress';

    await settlement.update({
      paid_amount: newPaid,
      due_amount: newDue,
      status: newStatus,
      updatedBy: user?.id?.toString() || user?.name,
    });

    return payment;
  }

  async getPayments(settlementUuid: string, orgId?: string): Promise<LamsSettlementPayment[]> {
    const where: any = { settlement_id: settlementUuid };
    if (orgId) where.org_id = orgId;
    return await this.paymentModel.findAll({
      where,
      order: [['installment_no', 'ASC'], ['payment_date', 'ASC']],
    });
  }
}
