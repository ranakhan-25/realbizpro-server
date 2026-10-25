/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectTask } from 'src/database/models/projects/project-task/pr_project-task_model';
import { ProjectTaskController } from './projec_task.controller';
import { ProjectTaskService } from './projec_task.service';


@Module({
  imports: [
    SequelizeModule.forFeature([ProjectTask]), 
  ],
  controllers: [ProjectTaskController],
  providers: [ProjectTaskService],
  exports: [ProjectTaskService],
})
export class ProjectTaskModule {}