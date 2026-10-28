import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadArea, LeadRequirementType } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { RequirementsReportController } from './requirements-report.controller';
import { RequirementsReportService } from './requirements-report.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadRequirement, Lead, LeadArea, LeadRequirementType, SysUser])],
  controllers: [RequirementsReportController],
  providers: [RequirementsReportService],
})
export class RequirementsReportModule {}
