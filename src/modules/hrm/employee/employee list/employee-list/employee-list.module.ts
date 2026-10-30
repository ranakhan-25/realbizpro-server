import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { EmployeeListController } from './employee-list.controller';

import { EmployeeListService } from './employee-list.service';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { Unit } from 'src/database/models/hrm/employee/hrm_unit_model'; // relation: new import
import { Section } from 'src/database/models/hrm/employee/hrm_section_model'; // relation: new import
import { Department } from 'src/database/models/hrm/employee/hrm_department_model'; // relation: new import
import { Designation } from 'src/database/models/hrm/employee/hrm_designation_model'; // relation: new import
import { SalaryGrade } from 'src/database/models/hrm/employee/hrm_salary_grade_model'; // relation: new import

import { Under } from 'src/database/models/hrm/employee/hrm_under_model'; // relation: new import
import { EmployeeType } from 'src/database/models/hrm/employee/hrm_employee_type-model';
import { Increment } from 'src/database/models/hrm/employee/hrm_increment_model';
import { Attendance } from 'src/database/models/hrm/employee/hrm_attendance_model';
import { BonusGenerate } from 'src/database/models/hrm/employee/hrm_bonus_generate_model';
import { Shift } from 'src/database/models/hrm/employee/hrm_shift_model';
import { AttendanceReconciliation } from 'src/database/models/hrm/attendance/attendance_reconciliation_model';
import { LeaveApplication } from 'src/database/models/hrm/leaveapplication/leaveapplication_modes';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmployeeList,
      Unit,
      Section,
      Department,
      Designation,
      SalaryGrade,
      Shift,
      EmployeeType,
      Under,
      Increment,
      Attendance,
      BonusGenerate,
      AttendanceReconciliation,
      LeaveApplication,
    ]), // relation: employee-er 8 ta relation model
  ],

  controllers: [EmployeeListController],

  providers: [EmployeeListService],

  exports: [EmployeeListService],
})
export class EmployeeListModule {}
