import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { CustomerAccountController } from './customer_accounts.controller';
import { CustomerAccountService } from './customer_accounts.service';
import { CustomerAccount } from 'src/database/models/projects/contract/pr_customer_accounts_model';

@Module({
  imports: [
    SequelizeModule.forFeature([CustomerAccount]),
  ],

  controllers: [CustomerAccountController],

  providers: [CustomerAccountService],

  exports: [CustomerAccountService],
})
export class CustomerAccountModule {}
