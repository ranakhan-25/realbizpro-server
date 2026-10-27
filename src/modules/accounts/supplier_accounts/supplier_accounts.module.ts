import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerAccount } from 'src/database/models/accounts/contact/acc_customers_accounts_model';
import { SupplierAccount } from 'src/database/models/accounts/contact/acc_supplier_accounts_model';
import { SupplierAccountsService } from './supplier_accounts.service';
import { SupplierAccountsController } from './supplier_accounts.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([SupplierAccount, CustomerAccount]),
  ],
  providers: [SupplierAccountsService],
  controllers: [SupplierAccountsController],
  exports: [SupplierAccountsService, SequelizeModule],
})
export class SupplierAccountsModule {}
