/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { DesignationController } from './designation.controller';

import { DesignationService } from './designation.service';
import { Designation } from 'src/database/models/hrm/employee/hrm_designation_model';
import { Department } from 'src/database/models/hrm/employee/hrm_department_model';

@Module({
  imports: [
    // relation: Department লাগবে (include + dropdown)
    SequelizeModule.forFeature([
      Designation,
      Department,
    ]),
  ],

  controllers: [DesignationController],

  providers: [DesignationService],

  exports: [DesignationService],
})
export class DesignationModule {}
