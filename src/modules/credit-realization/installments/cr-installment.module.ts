import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../../database/models/credit-realization/cr_installment_payment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentService } from './cr-installment.service';
import { CrInstallmentController } from './cr-installment.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrInstallmentPlan,
      CrInstallmentPayment,
      CrSaleAgreement,
    ]),
  ],
  controllers: [CrInstallmentController],
  providers: [CrInstallmentService],
  exports: [CrInstallmentService],
})
export class CrInstallmentModule {}
