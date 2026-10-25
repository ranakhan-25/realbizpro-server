import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { LeadArea } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { ProjectModule } from 'src/modules/projects/project/project.module';
import { CrmProjectController } from './crm-project.controller';
import { CrmProjectService } from './crm-project.service';

@Module({
  imports: [ProjectModule, SequelizeModule.forFeature([Project, ProjectType, LeadArea, SysUser])],
  controllers: [CrmProjectController],
  providers: [CrmProjectService],
})
export class CrmProjectModule {}
