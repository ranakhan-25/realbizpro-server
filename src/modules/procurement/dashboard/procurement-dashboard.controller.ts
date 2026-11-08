import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProcurementDashboardQueryDto } from './dto/procurement-dashboard.dto';
import { ProcurementDashboardService } from './procurement-dashboard.service';

@ApiTags('Procurement | Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/dashboard')
export class ProcurementDashboardController {
  constructor(private readonly service: ProcurementDashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get procurement dashboard KPIs, overflow materials and pending purchase bills' })
  @Permissions('view_procurement_dashboard')
  getDashboard(@Query() query: ProcurementDashboardQueryDto) {
    return this.service.getDashboard(query);
  }
}
