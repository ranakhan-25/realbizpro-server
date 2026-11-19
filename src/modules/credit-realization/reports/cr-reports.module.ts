import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../../database/models/credit-realization/cr_installment_payment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrOfficerAssignment } from '../../../database/models/credit-realization/cr_officer_assignment.model';
import { CrRecoveryLog } from '../../../database/models/credit-realization/cr_recovery_log.model';
import { CrReportsService } from './cr-reports.service';
import { CrReportsController } from './cr-reports.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrInstallmentPlan,
      CrInstallmentPayment,
      CrSaleAgreement,
      CrOfficerAssignment,
      CrRecoveryLog,
    ]),
  ],
  controllers: [CrReportsController],
  providers: [CrReportsService],
  exports: [CrReportsService],
})
export class CrReportsModule {}
