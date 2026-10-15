import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { OvertimeController } from './overtime.controller';

import { OvertimeService } from './overtime.service';
import { Overtime } from 'src/database/models/hrm/employee/hrm_overtime_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check

@Module({
  imports: [
    SequelizeModule.forFeature([
      Overtime,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [OvertimeController],

  providers: [OvertimeService],

  exports: [OvertimeService],
})
export class OvertimeModule {}
