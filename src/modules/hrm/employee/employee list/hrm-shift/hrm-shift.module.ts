/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { HrmShiftController } from './hrm-shift.controller';

import { HrmShiftService } from './hrm-shift.service';
import { HrmShift } from 'src/database/models/hrm/employee/hrm_hrm_shift_model';

@Module({
  imports: [SequelizeModule.forFeature([HrmShift])],

  controllers: [HrmShiftController],

  providers: [HrmShiftService],

  exports: [HrmShiftService],
})
export class HrmShiftModule {}
