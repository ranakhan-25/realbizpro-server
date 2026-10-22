import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AllowanceDeductionSetupController } from './allowance-deduction-setup.controller';
import { AllowanceDeductionSetupService } from './allowance-deduction-setup.service';
import { AllowanceDeductionSetup } from 'src/database/models/hrm/configuration/allowance_deducation_setup';
import { SalaryGradeItem } from 'src/database/models/hrm/configuration/hrm_salary_grade_item_model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AllowanceDeductionSetup,
      SalaryGradeItem,
    ]),
  ],
  controllers: [
    AllowanceDeductionSetupController,
  ],
  providers: [AllowanceDeductionSetupService],
  exports: [AllowanceDeductionSetupService],
})
export class AllowanceDeductionSetupModule {}
