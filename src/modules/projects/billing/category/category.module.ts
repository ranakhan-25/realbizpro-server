/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { WorkOrder } from 'src/database/models/projects/billing/work-order/pr_work_order.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BillingCategory,
      WorkOrder,
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
