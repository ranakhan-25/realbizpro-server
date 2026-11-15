/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { InstallmentPlan, Installment } from '../../../database/models/sales_management/sm_pay_installsment_model';
import { CreatePaymentDto } from './dto/create-pay_installemnt.dto';

@Injectable()
export class InstallmentsService {
  constructor(
    @InjectModel(Installment)
    private readonly installmentModel: typeof Installment,
    @InjectModel(InstallmentPlan)
    private readonly planModel: typeof InstallmentPlan,
  ) {}

  async getPlanDetails(identifier: string) {
    if (!identifier || identifier === 'null' || identifier === 'undefined') {
      throw new BadRequestException('A valid installment plan ID or plan code is required');
    }

    const plan = await this.planModel.findOne({
      where: { [Op.or]: [{ id: identifier }, { planCode: identifier }] } as any,
      include: [{ model: Installment, as: 'installments' }],
      order: [[{ model: Installment, as: 'installments' }, 'no', 'ASC']],
    });

    if (!plan) {
      throw new NotFoundException(`Installment Plan ${identifier} not found`);
    }

    return plan;
  }

  async payInstallment(dto: CreatePaymentDto) {
    if (!dto.planUuid || dto.planUuid === 'null' || dto.planUuid === 'undefined') {
      throw new BadRequestException('planUuid is required');
    }
    if (!dto.installmentUuid || dto.installmentUuid === 'null' || dto.installmentUuid === 'undefined') {
      throw new BadRequestException('installmentUuid is required');
    }

    const plan = await this.planModel.findOne({
      where: { [Op.or]: [{ id: dto.planUuid }, { planCode: dto.planUuid }] } as any,
    });

    if (!plan) {
      throw new NotFoundException(`Installment Plan not found with ID: ${dto.planUuid}`);
    }

    const installmentNumber = Number(dto.installmentUuid);
    let installment: Installment | null = null;

    if (Number.isInteger(installmentNumber) && installmentNumber > 0) {
      installment = await this.installmentModel.findOne({
        where: { planId: plan.id, no: installmentNumber } as any,
      });
    }

    if (!installment) {
      installment = await this.installmentModel.findOne({
        where: { id: dto.installmentUuid, planId: plan.id } as any,
      });
    }

    if (!installment) {
      throw new NotFoundException(`Installment not found in plan ${dto.planUuid}: ${dto.installmentUuid}`);
    }

    try {
      installment.status = 'Paid';
      installment.paidDate = new Date().toISOString().slice(0, 10);
      installment.method = dto.paymentMethod;
      installment.txn = dto.transactionId || `TXN-${Date.now()}`;
      await installment.save();

      return { success: true, message: 'Payment successful', data: installment };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to process payment');
    }
  }
}
