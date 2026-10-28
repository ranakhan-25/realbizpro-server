import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { Lead, } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadCampaign, LeadSource, LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { UserWiseReportController } from './user-wise-report.controller';
import { UserWiseReportService } from './user-wise-report.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead, LeadActivity, LeadSource, LeadCampaign, LeadTeam, LeadTeamMember, SysUser])],
  controllers: [UserWiseReportController],
  providers: [UserWiseReportService],
})
export class UserWiseReportModule {}
