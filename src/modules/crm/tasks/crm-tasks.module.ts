import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmInternalTask } from '../../../database/models/crm/crm_internal_task.model';
import { CrmInternalTaskAssignee } from '../../../database/models/crm/crm_internal_task_assignee.model';
import { CrmTasksService } from './crm-tasks.service';
import { CrmTasksController } from './crm-tasks.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrmInternalTask,
      CrmInternalTaskAssignee,
    ]),
  ],
  controllers: [CrmTasksController],
  providers: [CrmTasksService],
  exports: [CrmTasksService],
})
export class CrmTasksModule {}
