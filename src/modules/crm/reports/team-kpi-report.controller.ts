import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryTeamKpiReportDto } from './dto/query-team-kpi-report.dto';
import { TeamKpiReportService } from './team-kpi-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | KPI | Team KPI Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/kpi/team-kpi-report')
export class TeamKpiReportController {
  constructor(private readonly service: TeamKpiReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_team_kpi_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_team_kpi_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryTeamKpiReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
