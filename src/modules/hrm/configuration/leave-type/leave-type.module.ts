/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { LeaveTypeController } from './leave-type.controller';

import { LeaveTypeService } from './leave-type.service';
import { LeaveType } from 'src/database/models/hrm/configuration/leave_type_list';
import { LeaveApplication } from 'src/database/models/hrm/leaveapplication/leaveapplication_modes';

@Module({
  imports: [
    SequelizeModule.forFeature([
      LeaveType,
      LeaveApplication,
    ]),
  ],

  controllers: [LeaveTypeController],

  providers: [LeaveTypeService],

  exports: [LeaveTypeService],
})
export class LeaveTypeModule {}
