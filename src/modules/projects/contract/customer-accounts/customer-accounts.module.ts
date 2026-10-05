/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerAccount } from 'src/database/models/customer account/ca_customer_accounts_model';
import { CustomerAccountController } from './customer-accounts.controller';
import { CustomerAccountService } from './customer-accounts.service';

@Module({
  imports: [
    SequelizeModule.forFeature([CustomerAccount]),
  ],

  controllers: [CustomerAccountController],

  providers: [CustomerAccountService],

  exports: [CustomerAccountService],
})
export class CustomerAccountModule {}
