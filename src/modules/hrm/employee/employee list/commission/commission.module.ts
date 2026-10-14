/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { CommissionController } from './commission.controller';

import { CommissionService } from './commission.service';
import { Commission } from 'src/database/models/hrm/employee/hrm_commission_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check

@Module({
  imports: [
    SequelizeModule.forFeature([
      Commission,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [CommissionController],

  providers: [CommissionService],

  exports: [CommissionService],
})
export class CommissionModule {}
