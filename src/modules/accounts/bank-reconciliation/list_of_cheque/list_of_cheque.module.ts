/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cheque } from '../../../../database/models/accounts/bank-reconciliation/acc_cheque.model';
import { ChequeRange } from '../../../../database/models/accounts/bank-reconciliation/acc_cheque-range.model';
import { ChequeService } from './list_of_cheque.service';
import { ChequeController } from './list_of_cheque.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Cheque, ChequeRange]),
  ],
  controllers: [ChequeController],
  providers: [ChequeService],
  exports: [ChequeService],
})
export class ListOfChequeModule {}