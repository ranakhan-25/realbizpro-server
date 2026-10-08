/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project_model';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Project]),
  ],

  controllers: [ProjectController],

  providers: [ProjectService],

  exports: [ProjectService],
})
export class ProjectModule {}
