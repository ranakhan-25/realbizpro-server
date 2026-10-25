/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectCost } from 'src/database/models/projects/project_cost/pr_project_cost_model';
import { ProjectCostController } from './project_cost.controller';
import { ProjectCostService } from './project_cost.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectCost]), 
  ],
  controllers: [ProjectCostController],
  providers: [ProjectCostService],
  exports: [ProjectCostService],
})
export class ProjectCostModule {}