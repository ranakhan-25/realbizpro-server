import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from 'src/database/models/hrm/employee/hrm_attendance_model';
@Module({
  imports: [
    SequelizeModule.forFeature([Attendance]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
