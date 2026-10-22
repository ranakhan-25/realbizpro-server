/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AccountMappingController } from './account-mapping.controller';
import { AccountMappingService } from './account-mapping.service';
import { CategoryAccountMapping } from 'src/database/models/procurement/configuration/products/pr_category_account_mapping.model';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CategoryAccountMapping,
      Category, 
    ]),
  ],
  controllers: [AccountMappingController],
  providers: [AccountMappingService],
  exports: [AccountMappingService],
})
export class AccountMappingModule {}
