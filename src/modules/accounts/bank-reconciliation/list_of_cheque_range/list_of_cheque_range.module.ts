/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChequeRange } from '../../../../database/models/accounts/bank-reconciliation/acc_cheque-range.model';
import { Cheque } from '../../../../database/models/accounts/bank-reconciliation/acc_cheque.model';
import { ChequeRangeService } from './list_of_cheque_range.service';
import { ChequeRangeController } from './list_of_cheque_range.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ChequeRange, Cheque]),
  ],
  controllers: [ChequeRangeController],
  providers: [ChequeRangeService],
  exports: [ChequeRangeService],
})
export class ListOfChequeRangeModule {}