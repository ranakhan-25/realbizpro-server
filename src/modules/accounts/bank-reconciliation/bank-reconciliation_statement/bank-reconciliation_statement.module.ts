/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankReconciliation } from '../../../../database/models/accounts/bank-reconciliation/acc_bank-reconciliation.model';
import { BankReconciliationService } from './bank-reconciliation_statement.service';
import { BankReconciliationController } from './bank-reconciliation_statement.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([BankReconciliation]),
  ],
  controllers: [BankReconciliationController],
  providers: [BankReconciliationService],
  exports: [BankReconciliationService],
})
export class BankReconciliationStatementModule {}