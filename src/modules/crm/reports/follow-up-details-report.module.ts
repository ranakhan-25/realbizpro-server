import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommunicationStatus } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { FollowUpDetailsReportController } from './follow-up-details-report.controller';
import { FollowUpDetailsReportService } from './follow-up-details-report.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadActivity, Lead, LeadPropertyInterest, Project, SysUser, LeadStage, CommunicationStatus])],
  controllers: [FollowUpDetailsReportController],
  providers: [FollowUpDetailsReportService],
})
export class FollowUpDetailsReportModule {}
