/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PayableReport } from 'src/database/models/accounts/reports/acc_payeble_report_model';
import { PayableReportController } from './payeble_report.controller';
import { PayableReportService } from './payeble_report.service';


@Module({
  imports: [
    SequelizeModule.forFeature([PayableReport]),
  ],
  controllers: [PayableReportController],
  providers: [PayableReportService],
  exports: [PayableReportService],
})
export class PayableReportModule {}