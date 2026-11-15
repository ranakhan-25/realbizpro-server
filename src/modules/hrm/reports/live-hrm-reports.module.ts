import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attendance } from 'src/database/models/hrm/employee/hrm_attendance_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { PaySlip } from 'src/database/models/hrm/employee/hrm_pay_slip_model';
import { LeaveApplication } from 'src/database/models/hrm/leaveapplication/leaveapplication_modes';
import { LiveHrmReportsController } from './live-hrm-reports.controller';
import { LiveHrmReportsService } from './live-hrm-reports.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Attendance,
      EmployeeList,
      PaySlip,
      LeaveApplication,
    ]),
  ],
  controllers: [LiveHrmReportsController],
  providers: [LiveHrmReportsService],
})
export class LiveHrmReportsModule {}
