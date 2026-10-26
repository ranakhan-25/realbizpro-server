import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CrmLeadPipeline } from 'src/database/models/crm/lead/crm-lead-pipeline.model';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, Lead, LeadRequirement, CrmLeadPipeline])],
  controllers: [PipelineController],
  providers: [PipelineService],
})
export class PipelineModule {}
