/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChartOfAccount } from 'src/database/models/accounts/configuration/acc_chats_of_accounts_model';
import { ChartOfGroup } from 'src/database/models/accounts/configuration/acc_chats_of_group_model';
import { ChartOfAccountService } from './chats_of_accounts.service';
import { ChartOfAccountController } from './chats_of_accounts.controller';

@Module({
  imports: [
    // ✅ উভয় মডেল রেজিস্টার করুন (রিলেশনের জন্য)
    SequelizeModule.forFeature([ChartOfAccount, ChartOfGroup]),
  ],
  controllers: [ChartOfAccountController],
  providers: [ChartOfAccountService],
  exports: [ChartOfAccountService],
})
export class ChatsOfAccountsModule {}