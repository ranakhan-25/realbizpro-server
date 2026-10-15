/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { EmployeeTypeController } from './employee-type.controller';

import { EmployeeTypeService } from './employee-type.service';
import { EmployeeType } from 'src/database/models/hrm/employee/hrm_employee_type-model';

@Module({
  imports: [
    SequelizeModule.forFeature([EmployeeType]),
  ],

  controllers: [EmployeeTypeController],

  providers: [EmployeeTypeService],

  exports: [EmployeeTypeService],
})
export class EmployeeTypeModule {}
