/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FundRequisitionController } from './fund-requisition.controller';
import { FundRequisitionService } from './fund-requisition.service';
import { FundRequisition } from 'src/database/models/projects/fund-requisition/pr_fund_requisition.model';

@Module({
  imports: [
    SequelizeModule.forFeature([FundRequisition]),
  ],

  controllers: [FundRequisitionController],

  providers: [FundRequisitionService],

  exports: [FundRequisitionService],
})
export class FundRequisitionModule {}
