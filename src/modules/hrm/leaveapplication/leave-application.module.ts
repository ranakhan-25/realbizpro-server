/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { LeaveApplicationController } from './leave-application.controller';
import { LeaveApplicationService } from './leave-application.service';

import { LeaveApplication } from 'src/database/models/hrm/leaveapplication/leaveapplication_modes';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { LeaveType } from 'src/database/models/hrm/configuration/leave_type_list';

@Module({
  imports: [
    SequelizeModule.forFeature([
      LeaveApplication,
      EmployeeList,
      LeaveType,
    ]),
  ],

  controllers: [LeaveApplicationController],

  providers: [LeaveApplicationService],

  exports: [LeaveApplicationService],
})
export class LeaveApplicationModule {}
