/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExpenseReport } from 'src/database/models/accounts/reports/acc_expense-report.model';
import { ExpenseReportService } from './expense_reports.service';
import { ExpenseReportController } from './expense_reports.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ExpenseReport]),
  ],
  controllers: [ExpenseReportController],
  providers: [ExpenseReportService],
  exports: [ExpenseReportService],
})
export class ExpenseReportsModule {}