/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { EmployeeCardController } from './employee-card.controller';

import { EmployeeCardService } from './employee-card.service';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';

@Module({
  imports: [SequelizeModule.forFeature([EmployeeList])],

  controllers: [EmployeeCardController],

  providers: [EmployeeCardService],

  exports: [EmployeeCardService],
})
export class EmployeeCardModule {}
