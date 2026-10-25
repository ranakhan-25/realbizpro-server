import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmInternalTask, TaskType } from 'src/database/models/crm/configuration/crm-task-type.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { TaskTypeController } from './task-type.controller';
import { TaskTypeService } from './task-type.service';

@Module({
  imports: [SequelizeModule.forFeature([TaskType, CrmInternalTask, Lead])],
  controllers: [TaskTypeController],
  providers: [TaskTypeService],
  exports: [TaskTypeService],
})
export class TaskTypeModule {}
