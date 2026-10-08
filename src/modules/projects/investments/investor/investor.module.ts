/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { InvestorController } from './investor.controller';
import { InvestorService } from './investor.service';

import { Investor } from 'src/database/models/projects/investor/investor_model';
import { InvestorNominee } from 'src/database/models/projects/investor/investor_nominee_model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Investor,
      InvestorNominee,
    ]),
  ],

  controllers: [InvestorController],

  providers: [InvestorService],

  exports: [InvestorService],
})
export class InvestorModule {}
