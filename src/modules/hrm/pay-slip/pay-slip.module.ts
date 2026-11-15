import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attendance } from 'src/database/models/hrm/employee/hrm_attendance_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { PaySlip } from 'src/database/models/hrm/employee/hrm_pay_slip_model';
import { PaySlipController } from './pay-slip.controller';
import { PaySlipService } from './pay-slip.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaySlip,
      EmployeeList,
      Attendance,
    ]),
  ],
  controllers: [PaySlipController],
  providers: [PaySlipService],
})
export class PaySlipModule {}
