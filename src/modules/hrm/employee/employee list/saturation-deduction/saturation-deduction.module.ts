import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { SaturationDeductionController } from './saturation-deduction.controller';

import { SaturationDeductionService } from './saturation-deduction.service';
import { SaturationDeduction } from 'src/database/models/hrm/employee/hrm_saturationdeduction_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check

@Module({
  imports: [
    SequelizeModule.forFeature([
      SaturationDeduction,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [SaturationDeductionController],

  providers: [SaturationDeductionService],

  exports: [SaturationDeductionService],
})
export class SaturationDeductionModule {}
