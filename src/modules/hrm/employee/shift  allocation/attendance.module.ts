import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { AttendanceController } from './attendance.controller';

import { AttendanceService } from './attendance.service';
import { Attendance } from 'src/database/models/hrm/employee/hrm_attendance_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check

@Module({
  imports: [
    SequelizeModule.forFeature([
      Attendance,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [AttendanceController],

  providers: [AttendanceService],

  exports: [AttendanceService],
})
export class AttendanceModule {}
