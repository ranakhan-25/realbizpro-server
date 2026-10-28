/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BalanceSheet } from 'src/database/models/accounts/reports/acc_balance-summury_list_model';
import { BalanceSheetController } from './balance_summury.controller';
import { BalanceSheetService } from './balance_summury.service';

@Module({
  imports: [
    SequelizeModule.forFeature([BalanceSheet]),
  ],
  controllers: [BalanceSheetController],
  providers: [BalanceSheetService],
  exports: [BalanceSheetService],
})
export class BalanceSummuryModule {}