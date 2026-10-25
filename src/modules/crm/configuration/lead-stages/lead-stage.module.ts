import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommunicationStatus } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadStageController } from './lead-stage.controller';
import { LeadStageService } from './lead-stage.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadStage, Lead, CommunicationStatus])],
  controllers: [LeadStageController],
  providers: [LeadStageService],
  exports: [LeadStageService],
})
export class LeadStageModule {}
