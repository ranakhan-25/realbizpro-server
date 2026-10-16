import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { EmployeeHierarchyController } from './employee-hierarchy.controller';

import { EmployeeHierarchyService } from './employee-hierarchy.service';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { Designation } from 'src/database/models/hrm/employee/hrm_designation_model'; // relation: new import

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmployeeList,
      Designation,
    ]), // relation: Designation add
  ],

  controllers: [EmployeeHierarchyController],

  providers: [EmployeeHierarchyService],

  exports: [EmployeeHierarchyService],
})
export class EmployeeHierarchyModule {}
