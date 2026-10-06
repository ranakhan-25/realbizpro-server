import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { LabourWorkBankController } from './labour_work_bank.controller';

import { LabourWorkBankService } from './labour_work_bank.service';
import { LabourWorkBank } from 'src/database/models/projects/contract/pr_labour_work_bank_model';

@Module({
  imports: [
    SequelizeModule.forFeature([LabourWorkBank]),
  ],

  controllers: [LabourWorkBankController],

  providers: [LabourWorkBankService],

  exports: [LabourWorkBankService],
})
export class LabourWorkBankModule {}
