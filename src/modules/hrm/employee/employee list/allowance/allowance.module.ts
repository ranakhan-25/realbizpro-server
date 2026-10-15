/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { AllowanceController } from './allowance.controller';

import { AllowanceService } from './allowance.service';
import { Allowance } from 'src/database/models/hrm/employee/hrm_allowance_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check

@Module({
  imports: [
    SequelizeModule.forFeature([
      Allowance,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [AllowanceController],

  providers: [AllowanceService],

  exports: [AllowanceService],
})
export class AllowanceModule {}
