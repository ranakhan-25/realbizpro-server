/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from 'src/database/models/projects/task/pr_task_model';

@Module({
  imports: [
    SequelizeModule.forFeature([Task]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}