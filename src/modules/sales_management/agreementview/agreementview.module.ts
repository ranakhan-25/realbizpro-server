import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AgreementsController } from './agreementview.controller';
import { AgreementsService } from './agreementview.service';
import { Agreement } from '../../../database/models/sales_management/sm_agreement_view.model';

@Module({
  imports: [SequelizeModule.forFeature([Agreement])],
  controllers: [AgreementsController],
  providers: [AgreementsService],
  exports: [AgreementsService, SequelizeModule],
})
export class AgreementsModule {}
