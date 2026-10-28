import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryTeamSummaryReportDto } from './dto/query-team-summary-report.dto';
import { TeamSummaryReportService } from './team-summary-report.service';

@ApiTags('CRM | Reports | Team Summary Report')
@ApiBearerAuth()
@Controller('crm/reports/team-summary')
export class TeamSummaryReportController {
  constructor(private readonly service: TeamSummaryReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get active teams for the team summary report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get lead, visit and call/follow-up summaries grouped by team' })
  report(@Query() query: QueryTeamSummaryReportDto) { return this.service.report(query); }
}
