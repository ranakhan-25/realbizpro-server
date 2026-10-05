import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { SupplierAccountsController } from './supplier_accounts.controller';

import { SupplierAccountsService } from './supplier_accounts.service';
import { SupplierAccounts } from 'src/database/models/contract/pr_supplier_accounts_model';

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
