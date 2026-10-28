import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { InterestedFlatLandReportController } from './interested-flat-land-report.controller';
import { InterestedFlatLandReportService } from './interested-flat-land-report.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadPropertyInterest, Lead, LeadStage, Project, FlatLand, SysUser])],
  controllers: [InterestedFlatLandReportController],
  providers: [InterestedFlatLandReportService],
})
export class InterestedFlatLandReportModule {}
