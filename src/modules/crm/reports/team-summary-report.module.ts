import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { TeamSummaryReportController } from './team-summary-report.controller';
import { TeamSummaryReportService } from './team-summary-report.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead, LeadActivity, LeadTeam, LeadTeamMember, SysUser])],
  controllers: [TeamSummaryReportController],
  providers: [TeamSummaryReportService],
})
export class TeamSummaryReportModule {}
