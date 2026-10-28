import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmLeadNegotiation } from 'src/database/models/crm/call-center/crm-lead-negotiation.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { DealNegotiationReportController } from './deal-negotiation-report.controller';
import { DealNegotiationReportService } from './deal-negotiation-report.service';

@Module({
  imports: [SequelizeModule.forFeature([CrmLeadNegotiation, Lead, Project, FlatLand, SysUser])],
  controllers: [DealNegotiationReportController],
  providers: [DealNegotiationReportService],
})
export class DealNegotiationReportModule {}
