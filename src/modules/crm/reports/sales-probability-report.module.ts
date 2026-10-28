import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SalesProbabilityReportController } from './sales-probability-report.controller';
import { SalesProbabilityReportService } from './sales-probability-report.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead, LeadStage, SysUser])],
  controllers: [SalesProbabilityReportController],
  providers: [SalesProbabilityReportService],
})
export class SalesProbabilityReportModule {}
