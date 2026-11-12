import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CreateEmployeeKpiDto } from 'src/modules/crm/kpi/employee-kpi/dto/create-employee-kpi.dto';
import { QueryEmployeeKpiDto } from 'src/modules/crm/kpi/employee-kpi/dto/query-employee-kpi.dto';
import { UpdateEmployeeKpiDto } from 'src/modules/crm/kpi/employee-kpi/dto/update-employee-kpi.dto';
import { EmployeeKpiService } from 'src/modules/crm/kpi/employee-kpi/employee-kpi.service';
import { QueryEmployeeKpiCallReportDto } from 'src/modules/crm/reports/dto/query-employee-kpi-call-report.dto';
import { EmployeeKpiCallReportService } from 'src/modules/crm/reports/employee-kpi-call-report.service';
import { QueryTeamKpiReportDto } from 'src/modules/crm/reports/dto/query-team-kpi-report.dto';
import { TeamKpiReportService } from 'src/modules/crm/reports/team-kpi-report.service';

type RequestUser = Record<string, unknown>;

@ApiTags('HRM | KPI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('hrm/kpi')
export class HrmKpiController {
  constructor(
    private readonly settings: EmployeeKpiService,
    private readonly employeeReports: EmployeeKpiCallReportService,
    private readonly teamReports: TeamKpiReportService,
  ) {}

  private assertOrganization(user: RequestUser) {
    if (!user.orgId && !user.isSuperUser) {
      throw new ForbiddenException('An organization is required for HRM KPI access.');
    }
  }

  @Get('settings')
  @ApiOperation({ summary: 'List HRM KPI settings' })
  listSettings(@Query() query: QueryEmployeeKpiDto, @CurrentUser() user: RequestUser) {
    this.assertOrganization(user);
    return this.settings.findAll(query, user);
  }

  @Get('settings/dropdowns')
  @ApiOperation({ summary: 'Get HRM KPI setting dropdown options' })
  settingDropdowns(@CurrentUser() user: RequestUser) {
    this.assertOrganization(user);
    return this.settings.dropdowns(user);
  }

  @Post('settings')
  @ApiOperation({ summary: 'Create an HRM KPI setting' })
  createSetting(
    @Body() body: CreateEmployeeKpiDto,
    @CurrentUserId() userId: number,
    @CurrentUser() user: RequestUser,
  ) {
    this.assertOrganization(user);
    const scopedBody = {
      ...body,
      orgId: user.isSuperUser ? body.orgId : (user.orgId as number | undefined),
    };
    return this.settings.create(scopedBody, userId, user);
  }

  @Patch('settings/:uuid')
  @ApiOperation({ summary: 'Update an HRM KPI setting' })
  updateSetting(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() body: UpdateEmployeeKpiDto,
    @CurrentUserId() userId: number,
    @CurrentUser() user: RequestUser,
  ) {
    this.assertOrganization(user);
    const scopedBody = {
      ...body,
      ...(user.isSuperUser ? {} : { orgId: user.orgId as number | undefined }),
    };
    return this.settings.update(uuid, scopedBody, userId, user);
  }

  @Delete('settings/:uuid')
  @ApiOperation({ summary: 'Delete an HRM KPI setting' })
  deleteSetting(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() user: RequestUser,
  ) {
    this.assertOrganization(user);
    return this.settings.remove(uuid, userId, user);
  }

  @Get('reports/employee/dropdowns')
  @ApiOperation({ summary: 'Get employee KPI report filters' })
  employeeReportDropdowns(@CurrentUser() user: RequestUser) {
    this.assertOrganization(user);
    return this.employeeReports.dropdowns(user);
  }

  @Get('reports/employee')
  @ApiOperation({ summary: 'Generate employee KPI report' })
  employeeReport(
    @Query() query: QueryEmployeeKpiCallReportDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.assertOrganization(user);
    return this.employeeReports.report(query, user);
  }

  @Get('reports/team/dropdowns')
  @ApiOperation({ summary: 'Get team KPI report filters' })
  teamReportDropdowns(@CurrentUser() user: RequestUser) {
    this.assertOrganization(user);
    return this.teamReports.dropdowns(user);
  }

  @Get('reports/team')
  @ApiOperation({ summary: 'Generate team KPI report' })
  teamReport(
    @Query() query: QueryTeamKpiReportDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.assertOrganization(user);
    return this.teamReports.report(query, user);
  }
}
