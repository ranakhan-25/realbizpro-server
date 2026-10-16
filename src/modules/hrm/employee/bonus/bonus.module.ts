/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { BonusController } from './bonus.controller';

import { BonusService } from './bonus.service';
import { Bonus } from 'src/database/models/hrm/employee/hrm_bonus_model';
import { BonusGenerate } from 'src/database/models/hrm/employee/hrm_bonus_generate_model';
// relation: new import

@Module({
  imports: [
    SequelizeModule.forFeature([
      Bonus,
      BonusGenerate,
    ]), // relation: BonusGenerate add
  ],

  controllers: [BonusController],

  providers: [BonusService],

  exports: [BonusService],
})
export class BonusModule {}
