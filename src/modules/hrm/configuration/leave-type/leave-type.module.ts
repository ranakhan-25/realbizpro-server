/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { LeaveTypeController } from './leave-type.controller';

import { LeaveTypeService } from './leave-type.service';
import { LeaveType } from 'src/database/models/hrm/configuration/leave_type_list';

@Module({
  imports: [
    SequelizeModule.forFeature([LeaveType]),
  ],

  controllers: [LeaveTypeController],

  providers: [LeaveTypeService],

  exports: [LeaveTypeService],
})
export class LeaveTypeModule {}
