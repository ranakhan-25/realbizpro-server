/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { HolidayController } from './holiday.controller';

import { HolidayService } from './holiday.service';
import { Holiday } from 'src/database/models/hrm/configuration/holiday_model';

@Module({
  imports: [
    SequelizeModule.forFeature([Holiday]),
  ],

  controllers: [HolidayController],

  providers: [HolidayService],

  exports: [HolidayService],
})
export class HolidayModule {}
