import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrWaiverRequest } from '../../../database/models/credit-realization/cr_waiver_request.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrWaiverService } from './cr-waiver.service';
import { CrWaiverController } from './cr-waiver.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrWaiverRequest,
      CrSaleAgreement,
      CrInstallmentPlan,
    ]),
  ],
  controllers: [CrWaiverController],
  providers: [CrWaiverService],
  exports: [CrWaiverService],
})
export class CrWaiverModule {}
