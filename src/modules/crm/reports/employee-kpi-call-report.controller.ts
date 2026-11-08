import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryEmployeeKpiCallReportDto } from './dto/query-employee-kpi-call-report.dto';
import { EmployeeKpiCallReportService } from './employee-kpi-call-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Employee KPI Call Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/employee-kpi-call-report')
export class EmployeeKpiCallReportController {
  constructor(private readonly service: EmployeeKpiCallReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_employee_kpi_call_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_employee_kpi_call_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryEmployeeKpiCallReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
