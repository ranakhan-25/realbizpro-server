import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { MissedFollowupVisitSummaryController } from './missed-followup-visit-summary.controller';
import { MissedFollowupVisitSummaryService } from './missed-followup-visit-summary.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead, LeadActivity, LeadTeam, LeadTeamMember, SysUser])],
  controllers: [MissedFollowupVisitSummaryController],
  providers: [MissedFollowupVisitSummaryService],
})
export class MissedFollowupVisitSummaryModule {}
