import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProcurementDashboardQueryDto } from './dto/procurement-dashboard.dto';
import { ProcurementDashboardService } from './procurement-dashboard.service';

@ApiTags('Procurement | Dashboard')
@ApiBearerAuth()
@Controller('procurement/dashboard')
export class ProcurementDashboardController {
  constructor(private readonly service: ProcurementDashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get procurement dashboard KPIs, overflow materials and pending purchase bills' })
  getDashboard(@Query() query: ProcurementDashboardQueryDto) {
    return this.service.getDashboard(query);
  }
}
