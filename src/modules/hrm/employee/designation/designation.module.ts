import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { DesignationController } from './designation.controller';

import { DesignationService } from './designation.service';
import { Designation } from 'src/database/models/hrm/employee/hrm_designation_model';
import { Department } from 'src/database/models/hrm/employee/hrm_department_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { Increment } from 'src/database/models/hrm/employee/hrm_increment_model';

@Module({
  imports: [
    // relation: Department লাগবে (include + dropdown)
    SequelizeModule.forFeature([
      Designation,
      Department,
      EmployeeList,
      Increment,
    ]),
  ],

  controllers: [DesignationController],

  providers: [DesignationService],

  exports: [DesignationService],
})
export class DesignationModule {}
