/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([BillingCategory]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
