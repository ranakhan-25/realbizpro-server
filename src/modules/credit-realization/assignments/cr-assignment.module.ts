import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrOfficerAssignment } from '../../../database/models/credit-realization/cr_officer_assignment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../../database/models/credit-realization/cr_installment_payment.model';
import { CrAssignmentService } from './cr-assignment.service';
import { CrAssignmentController } from './cr-assignment.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrOfficerAssignment,
      CrSaleAgreement,
      CrInstallmentPlan,
      CrInstallmentPayment,
    ]),
  ],
  controllers: [CrAssignmentController],
  providers: [CrAssignmentService],
  exports: [CrAssignmentService],
})
export class CrAssignmentModule {}
