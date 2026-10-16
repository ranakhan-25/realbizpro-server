import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { LoanController } from './loan.controller';

import { LoanService } from './loan.service';
import { Loan } from 'src/database/models/hrm/employee/hrm_loan_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model'; // relation: employee check

@Module({
  imports: [
    SequelizeModule.forFeature([
      Loan,
      EmployeeList,
    ]), // relation: EmployeeList add
  ],

  controllers: [LoanController],

  providers: [LoanService],

  exports: [LoanService],
})
export class LoanModule {}
