/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { MonthYearController } from './month-year.controller';

import { MonthYearService } from './month-year.service';
import { MonthYear } from 'src/database/models/hrm/employee/hrm_monthyear_model';
import { Attendance } from 'src/database/models/hrm/employee/hrm_attendance_model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MonthYear,
      Attendance,
    ]),
  ],

  controllers: [MonthYearController],

  providers: [MonthYearService],

  exports: [MonthYearService],
})
export class MonthYearModule {}
