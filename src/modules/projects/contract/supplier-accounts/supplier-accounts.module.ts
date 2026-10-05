/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { SupplierAccountsController } from './supplier-accounts.controller';

import { SupplierAccountsService } from './supplier-accounts.service';
import { SupplierAccounts } from 'src/database/models/supplier accounts/sa_supplier_accounts_model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SupplierAccounts,
    ]),
  ],

  controllers: [SupplierAccountsController],

  providers: [SupplierAccountsService],

  exports: [SupplierAccountsService],
})
export class SupplierAccountsModule {}
