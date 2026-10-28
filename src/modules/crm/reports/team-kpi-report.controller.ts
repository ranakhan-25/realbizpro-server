import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryTeamKpiReportDto } from './dto/query-team-kpi-report.dto';
import { TeamKpiReportService } from './team-kpi-report.service';

@ApiTags('CRM | KPI | Team KPI Report')
@ApiBearerAuth()
@Controller('crm/kpi/team-kpi-report')
export class TeamKpiReportController {
  constructor(private readonly service: TeamKpiReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get active teams for the Team KPI Report filter' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get team KPI call and task achievement report' })
  report(@Query() query: QueryTeamKpiReportDto) { return this.service.report(query); }
}
