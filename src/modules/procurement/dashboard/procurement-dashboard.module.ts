import { Module } from '@nestjs/common';
import { ProcurementDashboardController } from './procurement-dashboard.controller';
import { ProcurementDashboardService } from './procurement-dashboard.service';

@Module({ controllers: [ProcurementDashboardController], providers: [ProcurementDashboardService] })
export class ProcurementDashboardModule {}
