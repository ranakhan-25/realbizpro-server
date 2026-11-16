import { Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CrInstallmentSetup } from '../../database/models/credit-realization/cr_installment_setup.model';
import { CrSaleAgreement } from '../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../database/models/credit-realization/cr_installment_payment.model';
import { CrPlotDistribution } from '../../database/models/credit-realization/cr_plot_distribution.model';
import { CrRecoveryLog } from '../../database/models/credit-realization/cr_recovery_log.model';
import { CrOfficerAssignment } from '../../database/models/credit-realization/cr_officer_assignment.model';
import { CrFinancialAdjustment } from '../../database/models/credit-realization/cr_financial_adjustment.model';
import { CrWaiverRequest } from '../../database/models/credit-realization/cr_waiver_request.model';
import { CrSetupModule } from './setups/cr-setup.module';
import { CrAgreementModule } from './agreements/cr-agreement.module';
import { CrInstallmentModule } from './installments/cr-installment.module';
import { CrRecoveryModule } from './recovery/cr-recovery.module';
import { CrReportsModule } from './reports/cr-reports.module';
import { CrAssignmentModule } from './assignments/cr-assignment.module';
import { CrAdjustmentModule } from './adjustments/cr-adjustment.module';
import { CrWaiverModule } from './waivers/cr-waiver.module';

@Module({
  imports: [
    CrSetupModule,
    CrAgreementModule,
    CrInstallmentModule,
    CrRecoveryModule,
    CrReportsModule,
    CrAssignmentModule,
    CrAdjustmentModule,
    CrWaiverModule,
  ],
  exports: [
    CrSetupModule,
    CrAgreementModule,
    CrInstallmentModule,
    CrRecoveryModule,
    CrReportsModule,
    CrAssignmentModule,
    CrAdjustmentModule,
    CrWaiverModule,
  ],
})
export class CreditRealizationModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  onModuleInit() {
    const models = [
      CrSaleAgreement,
      CrInstallmentPlan,
      CrInstallmentPayment,
      CrPlotDistribution,
      CrRecoveryLog,
      CrOfficerAssignment,
      CrFinancialAdjustment,
      CrWaiverRequest,
      CrInstallmentSetup,
    ];
    const unregistered = models.filter((m) => !this.sequelize.isDefined(m.name));
    if (unregistered.length) {
      this.sequelize.addModels(unregistered);
    }
  }
}
