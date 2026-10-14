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
import { HrmShift } from 'src/database/models/hrm/employee/hrm_hrm_shift_model'; // relation: new import
// relation: new import
import { Under } from 'src/database/models/hrm/employee/hrm_under_model'; // relation: new import
import { EmployeeType } from 'src/database/models/hrm/employee/hrm_employee_type-model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmployeeList,
      Unit,
      Section,
      Department,
      Designation,
      SalaryGrade,
      HrmShift,
      EmployeeType,
      Under,
    ]), // relation: employee-er 8 ta relation model
  ],

  controllers: [EmployeeListController],

  providers: [EmployeeListService],

  exports: [EmployeeListService],
})
export class EmployeeListModule {}
