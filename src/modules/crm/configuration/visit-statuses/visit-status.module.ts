import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { VisitStatusController } from './visit-status.controller';
import { VisitStatusService } from './visit-status.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadVisitStatus, LeadActivity])],
  controllers: [VisitStatusController],
  providers: [VisitStatusService],
  exports: [VisitStatusService],
})
export class VisitStatusModule {}
