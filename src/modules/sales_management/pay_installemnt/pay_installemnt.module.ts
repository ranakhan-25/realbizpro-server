import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstallmentsController } from './pay_installemnt.controller';
import { InstallmentsService } from './pay_installemnt.service';
import { InstallmentPlan, Installment } from 'src/database/models/sales_management/sm_pay_installsment_model';


@Module({
  imports: [SequelizeModule.forFeature([InstallmentPlan, Installment])],
  controllers: [InstallmentsController],
  providers: [InstallmentsService],
})
export class PayInstallemntModule {}
