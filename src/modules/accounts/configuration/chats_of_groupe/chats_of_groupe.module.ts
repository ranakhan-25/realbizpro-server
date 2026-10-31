/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChartOfGroup } from 'src/database/models/accounts/configuration/acc_chats_of_group_model';
import { ChartOfAccount } from 'src/database/models/accounts/configuration/acc_chats_of_accounts_model';
import { ChartOfGroupService } from './chats_of_groupe.service';
import { ChartOfGroupController } from './chats_of_groupe.controller';

@Module({
  imports: [
    // ✅ উভয় মডেল রেজিস্টার করুন (রিলেশনের জন্য)
    SequelizeModule.forFeature([ChartOfGroup, ChartOfAccount]),
  ],
  controllers: [ChartOfGroupController],
  providers: [ChartOfGroupService],
  exports: [ChartOfGroupService],
})
export class ChatsOfGroupeModule {}