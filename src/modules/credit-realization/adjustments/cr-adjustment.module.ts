import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrFinancialAdjustment } from '../../../database/models/credit-realization/cr_financial_adjustment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrAdjustmentService } from './cr-adjustment.service';
import { CrAdjustmentController } from './cr-adjustment.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrFinancialAdjustment,
      CrSaleAgreement,
      CrInstallmentPlan,
    ]),
  ],
  controllers: [CrAdjustmentController],
  providers: [CrAdjustmentService],
  exports: [CrAdjustmentService],
})
export class CrAdjustmentModule {}
