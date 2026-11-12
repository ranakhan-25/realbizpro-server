import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommissionsController } from './commission_form.controller';
import { CommissionsService } from './commission_form.service';
import { Agent } from 'src/database/models/sales_management/sm_commission_form_agent_model';
import { Commission } from 'src/database/models/sales_management/sm_commission_form_model';

@Module({
  imports: [SequelizeModule.forFeature([Agent, Commission])],
  controllers: [CommissionsController],
  providers: [CommissionsService],
  exports: [CommissionsService, SequelizeModule],
})
export class CommissionFormModule {}
