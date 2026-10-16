import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { MonthYearController } from './month-year.controller';
import { MonthYearService } from './month-year.service';
import { MonthYear } from 'src/database/models/hrm/employee/hrm_monthyear_model';
@Module({
  imports: [
    SequelizeModule.forFeature([MonthYear]),
  ],
  controllers: [MonthYearController],
  providers: [MonthYearService],
  exports: [MonthYearService],
})
export class MonthYearModule {}
