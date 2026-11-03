/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from 'src/database/models/accounts/vouchers/acc_expence_list_model';
import { ExpenseController } from './expense_list.controller';
import { ExpenseService } from './expense_list.service';
import { ExpenseItem } from 'src/database/models/accounts/vouchers/acc_expense-item.model';


@Module({
  imports: [
    SequelizeModule.forFeature([Expense,ExpenseItem]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseListModule {}