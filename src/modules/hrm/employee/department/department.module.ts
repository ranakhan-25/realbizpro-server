/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { DepartmentController } from './department.controller';

import { DepartmentService } from './department.service';
import { Department } from 'src/database/models/hrm/employee/hrm_department_model';
import { Designation } from 'src/database/models/hrm/employee/hrm_designation_model'; // relation: new import

@Module({
  imports: [
    SequelizeModule.forFeature([
      Department,
      Designation,
    ]), // relation: Designation add
  ],

  controllers: [DepartmentController],

  providers: [DepartmentService],

  exports: [DepartmentService],
})
export class DepartmentModule {}
