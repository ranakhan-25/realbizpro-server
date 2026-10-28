import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { LeadTeam, } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SalesPipelineFunnelReportController } from './sales-pipeline-funnel-report.controller';
import { SalesPipelineFunnelReportService } from './sales-pipeline-funnel-report.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead, LeadStage, LeadTeam, LeadTeamMember, Project, SysUser])],
  controllers: [SalesPipelineFunnelReportController],
  providers: [SalesPipelineFunnelReportService],
})
export class SalesPipelineFunnelReportModule {}
