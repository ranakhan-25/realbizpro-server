/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { IncrementController } from './increment.controller';

import { IncrementService } from './increment.service';
import { Increment } from 'src/database/models/hrm/employee/hrm_increment_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check

@Module({
  imports: [
    SequelizeModule.forFeature([
      Increment,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [IncrementController],

  providers: [IncrementService],

  exports: [IncrementService],
})
export class IncrementModule {}
