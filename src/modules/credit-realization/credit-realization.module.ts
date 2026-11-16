import { Module } from '@nestjs/common';
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
export class CreditRealizationModule {}
