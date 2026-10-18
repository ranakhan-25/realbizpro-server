/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from 'src/database/models/projects/billing/pr_item.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Item, BillingCategory, BillingSubCategory]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}