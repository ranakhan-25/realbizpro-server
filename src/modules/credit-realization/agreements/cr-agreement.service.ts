import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrPlotDistribution } from '../../../database/models/credit-realization/cr_plot_distribution.model';
import { CrRecoveryLog } from '../../../database/models/credit-realization/cr_recovery_log.model';
import {
  CreateCrSaleAgreementDto,
  UpdateCrSaleAgreementDto,
  CreateCrPlotDistributionDto,
} from './dto/create-cr-agreement.dto';

@Injectable()
export class CrAgreementService {
  constructor(
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
    @InjectModel(CrInstallmentPlan)
    private readonly planModel: typeof CrInstallmentPlan,
    @InjectModel(CrPlotDistribution)
    private readonly plotModel: typeof CrPlotDistribution,
    @InjectModel(CrRecoveryLog)
    private readonly recoveryModel: typeof CrRecoveryLog,
  ) {}

  async create(createDto: CreateCrSaleAgreementDto): Promise<CrSaleAgreement> {
    const { number_of_installments, ...agreementData } = createDto;
    const agreement = await this.agreementModel.create(agreementData as any);

    // Auto-generate installment schedule if number_of_installments is provided
    if (number_of_installments && number_of_installments > 0) {
      const totalPrice = Number(createDto.total_price || (agreement as any).total_price || 0);
      const downPayment = Number(createDto.down_payment || (agreement as any).down_payment || 0);
      const bookingMoney = Number(createDto.booking_money || (agreement as any).booking_money || 0);
      const remainingBalance = totalPrice - downPayment - bookingMoney;
      const perInstallmentAmount = parseFloat(
        (remainingBalance / number_of_installments).toFixed(2),
      );

      const dateStr = String(createDto.agreement_date || agreement.agreement_date || '2026-08-01');
      const parts = dateStr.includes('-') ? dateStr.split('-').map(Number) : [2026, 8, 1];
      const startYear = parts[0] || 2026;
      const startMonth = parts[1] || 8;
      const startDay = parts[2] || 1;

      for (let i = 1; i <= number_of_installments; i++) {
        const dueDate = new Date(Date.UTC(startYear, startMonth - 1 + i, startDay));
        const formattedDate = dueDate.toISOString().slice(0, 10);

        await this.planModel.create({
          sale_agreement_id: agreement.id,
          installment_no: i,
          title: `Installment #${i}`,
          due_date: formattedDate,
          payable_amount: perInstallmentAmount,
          paid_amount: 0,
          due_amount: perInstallmentAmount,
          delay_days: 0,
          penalty_amount: 0,
          penalty_waived: 0,
          status: 'unpaid',
          projectId: agreement.projectId,
        } as any);
      }
    }

    return this.findOne(agreement.uuid);
  }

  async findAll(): Promise<CrSaleAgreement[]> {
    return await this.agreementModel.findAll({
      include: [
        { model: this.planModel, as: 'installment_plans' },
        { model: this.plotModel, as: 'plot_distributions' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(uuid: string): Promise<CrSaleAgreement> {
    const agreement = await this.agreementModel.findOne({
      where: { uuid },
      include: [
        {
          model: this.planModel,
          as: 'installment_plans',
          order: [['installment_no', 'ASC']],
        },
        { model: this.plotModel, as: 'plot_distributions' },
        { model: this.recoveryModel, as: 'recovery_logs' },
      ],
    });
    if (!agreement) throw new NotFoundException('Sale Agreement not found');
    return agreement;
  }

  async update(uuid: string, updateDto: UpdateCrSaleAgreementDto): Promise<CrSaleAgreement> {
    const agreement = await this.findOne(uuid);
    await agreement.update(updateDto as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string): Promise<{ success: boolean; message: string }> {
    const agreement = await this.findOne(uuid);
    await agreement.destroy();
    return { success: true, message: 'Sale Agreement deleted' };
  }

  async addPlotDistribution(uuid: string, dto: CreateCrPlotDistributionDto) {
    const agreement = await this.findOne(uuid);
    return await this.plotModel.create({
      ...dto,
      sale_agreement_id: agreement.id,
      projectId: agreement.projectId,
    } as any);
  }
}
