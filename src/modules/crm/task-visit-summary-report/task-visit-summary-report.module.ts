import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { TaskVisitSummaryReportController } from './task-visit-summary-report.controller';
import { TaskVisitSummaryReportService } from './task-visit-summary-report.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadActivity, LeadVisitStatus, Lead, SysUser])],
  controllers: [TaskVisitSummaryReportController],
  providers: [TaskVisitSummaryReportService],
})
export class TaskVisitSummaryReportModule {}
