import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrPlotDistribution } from '../../../database/models/credit-realization/cr_plot_distribution.model';
import { CrRecoveryLog } from '../../../database/models/credit-realization/cr_recovery_log.model';
import { CrAgreementService } from './cr-agreement.service';
import { CrAgreementController } from './cr-agreement.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrSaleAgreement,
      CrInstallmentPlan,
      CrPlotDistribution,
      CrRecoveryLog,
    ]),
  ],
  controllers: [CrAgreementController],
  providers: [CrAgreementService],
  exports: [CrAgreementService],
})
export class CrAgreementModule {}
