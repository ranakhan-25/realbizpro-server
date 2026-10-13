import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from 'src/database/models/hrm/employee/hrm_employee_model';
@Module({
  imports: [
    SequelizeModule.forFeature([Employee]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
