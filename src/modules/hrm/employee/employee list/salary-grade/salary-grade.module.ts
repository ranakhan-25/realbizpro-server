import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { SalaryGradeController } from './salary-grade.controller';

import { SalaryGradeService } from './salary-grade.service';
import { SalaryGrade } from 'src/database/models/hrm/employee/hrm_salary_grade_model';

@Module({
  imports: [
    SequelizeModule.forFeature([SalaryGrade]),
  ],

  controllers: [SalaryGradeController],

  providers: [SalaryGradeService],

  exports: [SalaryGradeService],
})
export class SalaryGradeModule {}
