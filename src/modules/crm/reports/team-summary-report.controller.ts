import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryTeamSummaryReportDto } from './dto/query-team-summary-report.dto';
import { TeamSummaryReportService } from './team-summary-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Team Summary Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/team-summary')
export class TeamSummaryReportController {
  constructor(private readonly service: TeamSummaryReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_team_summary_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_team_summary_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryTeamSummaryReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
