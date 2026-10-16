/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { Contractor } from 'src/database/models/projects/contract/pr_contractor.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Contractor]),
  ],

  controllers: [ContractorController],

  providers: [ContractorService],

  exports: [ContractorService],
})
export class ContractorModule {}
