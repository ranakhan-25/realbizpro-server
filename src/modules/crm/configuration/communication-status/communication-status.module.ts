import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommunicationStatus } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { CommunicationStatusController } from './communication-status.controller';
import { CommunicationStatusService } from './communication-status.service';

@Module({
  imports: [SequelizeModule.forFeature([CommunicationStatus, LeadStage])],
  controllers: [CommunicationStatusController],
  providers: [CommunicationStatusService],
  exports: [CommunicationStatusService],
})
export class CommunicationStatusModule {}
