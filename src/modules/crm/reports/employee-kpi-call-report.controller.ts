import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryEmployeeKpiCallReportDto } from './dto/query-employee-kpi-call-report.dto';
import { EmployeeKpiCallReportService } from './employee-kpi-call-report.service';

@ApiTags('CRM | Reports | Employee KPI Call Report')
@ApiBearerAuth()
@Controller('crm/reports/employee-kpi-call-report')
export class EmployeeKpiCallReportController {
  constructor(private readonly service: EmployeeKpiCallReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get active staff/employees for the Employee KPI Call Report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get Employee KPI call and task achievement report' })
  report(@Query() query: QueryEmployeeKpiCallReportDto) { return this.service.report(query); }
}
