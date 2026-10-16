/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { BonusGenerateController } from './bonus-generate.controller';

import { BonusGenerateService } from './bonus-generate.service';
import { BonusGenerate } from 'src/database/models/hrm/employee/hrm_bonus_generate_model';
import { Bonus } from 'src/database/models/hrm/employee/hrm_bonus_model'; // relation: new import
import { Employee } from 'src/database/models/hrm/employee/hrm_employee_model'; // relation: new import

@Module({
  imports: [
    SequelizeModule.forFeature([
      BonusGenerate,
      Bonus,
      Employee,
    ]), // relation: Bonus, Employee add
  ],

  controllers: [BonusGenerateController],

  providers: [BonusGenerateService],

  exports: [BonusGenerateService],
})
export class BonusGenerateModule {}
