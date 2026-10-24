/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectBudget } from 'src/database/models/projects/project_budget/pr_project_budget_model';
import { ProjectBudgetController } from './project_budget.controller';
import { ProjectBudgetService } from './project_budget.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectBudget]), 
  ],
  controllers: [ProjectBudgetController],
  providers: [ProjectBudgetService],
  exports: [ProjectBudgetService],
})
export class ProjectBudgetModule {}