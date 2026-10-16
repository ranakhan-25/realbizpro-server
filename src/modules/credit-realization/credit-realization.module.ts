import { Module } from '@nestjs/common';
import { CrSetupModule } from './setups/cr-setup.module';
import { CrAgreementModule } from './agreements/cr-agreement.module';
import { CrInstallmentModule } from './installments/cr-installment.module';
import { CrRecoveryModule } from './recovery/cr-recovery.module';
import { CrReportsModule } from './reports/cr-reports.module';

@Module({
  imports: [
    CrSetupModule,
    CrAgreementModule,
    CrInstallmentModule,
    CrRecoveryModule,
    CrReportsModule,
  ],
  exports: [
    CrSetupModule,
    CrAgreementModule,
    CrInstallmentModule,
    CrRecoveryModule,
    CrReportsModule,
  ],
})
export class CreditRealizationModule {}
