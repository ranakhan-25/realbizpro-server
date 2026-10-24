/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectProgressController } from './project_progress.controller';
import { ProjectProgressService } from './project_progress.service';
import { ProjectProgress } from 'src/database/models/projects/project-progress/pr_project-progress_model';
@Module({
  imports: [
    SequelizeModule.forFeature([ProjectProgress]), 
  ],
  controllers: [ProjectProgressController],
  providers: [ProjectProgressService],
  exports: [ProjectProgressService],
})
export class ProjectProgressModule {}