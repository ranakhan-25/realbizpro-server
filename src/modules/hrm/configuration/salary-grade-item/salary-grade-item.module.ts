import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SalaryGradeItemController } from './salary-grade-item.controller';
import { SalaryGradeItemService } from './salary-grade-item.service';

import { AllowanceDeductionSetup } from 'src/database/models/hrm/configuration/allowance_deducation_setup';
import { SalaryGradeItem } from 'src/database/models/hrm/configuration/hrm_salary_grade_item_model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SalaryGradeItem,
      AllowanceDeductionSetup,
    ]),
  ],
  controllers: [SalaryGradeItemController],
  providers: [SalaryGradeItemService],
  exports: [SalaryGradeItemService],
})
export class SalaryGradeItemModule {}
