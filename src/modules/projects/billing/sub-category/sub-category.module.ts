/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BillingSubCategory,
      BillingCategory,
    ]),
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
