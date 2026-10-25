/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectControlController } from './project_control.controller';
import { ProjectControl } from 'src/database/models/projects/project_control/pr_project_control_model';
import { ProjectControlService } from './project_control.service';


@Module({
  imports: [
    SequelizeModule.forFeature([ProjectControl]), 
  ],
  controllers: [ProjectControlController],
  providers: [ProjectControlService],
  exports: [ProjectControlService],
})
export class ProjectControlModule {}