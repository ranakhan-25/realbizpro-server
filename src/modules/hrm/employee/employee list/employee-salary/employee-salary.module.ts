/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { EmployeeSalaryController } from './employee-salary.controller';

import { EmployeeSalaryService } from './employee-salary.service';
import { EmployeeSalary } from 'src/database/models/hrm/employee/hrm_employeesalary_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmployeeSalary,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [EmployeeSalaryController],

  providers: [EmployeeSalaryService],

  exports: [EmployeeSalaryService],
})
export class EmployeeSalaryModule {}
