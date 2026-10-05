/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { LabourWorkBankController } from './labour-work-bank.controller';

import { LabourWorkBankService } from './labour-work-bank.service';
import { LabourWorkBank } from 'src/database/models/labour work bank/lb_labour_work_bank_model';

@Module({
  imports: [
    SequelizeModule.forFeature([LabourWorkBank]),
  ],

  controllers: [LabourWorkBankController],

  providers: [LabourWorkBankService],

  exports: [LabourWorkBankService],
})
export class LabourWorkBankModule {}
