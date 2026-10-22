/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { CategoryAccountMapping } from 'src/database/models/procurement/configuration/products/pr_category_account_mapping.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Category,
      CategoryAccountMapping,
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
