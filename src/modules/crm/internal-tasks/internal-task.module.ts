import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmInternalTask, CrmInternalTaskAssignee, TaskType } from 'src/database/models/crm/configuration/crm-task-type.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { InternalTaskController } from './internal-task.controller';
import { InternalTaskService } from './internal-task.service';

@Module({
  imports: [SequelizeModule.forFeature([CrmInternalTask, CrmInternalTaskAssignee, TaskType, Lead, Project, SysUser])],
  controllers: [InternalTaskController],
  providers: [InternalTaskService],
  exports: [InternalTaskService],
})
export class InternalTaskModule {}
