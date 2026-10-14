import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { ShiftController } from './shift.controller';

import { ShiftService } from './shift.service';
import { Shift } from 'src/database/models/hrm/employee/hrm_shift_model';
import { ShiftSchedule } from 'src/database/models/hrm/employee/hrm_shift_schedule_model';

@Module({
  imports: [
    // relation: Shift + ShiftSchedule duitai lagbe
    SequelizeModule.forFeature([
      Shift,
      ShiftSchedule,
    ]),
  ],

  controllers: [ShiftController],

  providers: [ShiftService],

  exports: [ShiftService],
})
export class ShiftModule {}
