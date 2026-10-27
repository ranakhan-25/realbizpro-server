/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerAccount } from 'src/database/models/accounts/contact/acc_customers_accounts_model';
import { CustomerAccountService } from './customers_accounts.service';
import { CustomerAccountController } from './customers_accounts.controller';


@Module({
  imports: [
    SequelizeModule.forFeature([CustomerAccount]),
  ],
  controllers: [CustomerAccountController],
  providers: [CustomerAccountService],
  exports: [CustomerAccountService],
})
export class CustomersAccountsModule {}