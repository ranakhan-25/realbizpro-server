/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { UnitController } from './unit.controller';

import { UnitService } from './unit.service';
import { Unit } from 'src/database/models/hrm/employee/hrm_unit_model';

@Module({
  imports: [SequelizeModule.forFeature([Unit])],

  controllers: [UnitController],

  providers: [UnitService],

  exports: [UnitService],
})
export class UnitModule {}
