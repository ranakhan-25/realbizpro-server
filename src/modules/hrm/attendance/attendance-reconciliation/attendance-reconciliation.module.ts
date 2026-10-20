/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { AttendanceReconciliationController } from './attendance-reconciliation.controller';

import { AttendanceReconciliationService } from './attendance-reconciliation.service';

import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check
import { AttendanceReconciliation } from 'src/database/models/hrm/attendance/attendance_reconciliation_model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AttendanceReconciliation,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [
    AttendanceReconciliationController,
  ],

  providers: [AttendanceReconciliationService],

  exports: [AttendanceReconciliationService],
})
export class AttendanceReconciliationModule {}
