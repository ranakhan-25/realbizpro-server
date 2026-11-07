import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryTaskVisitSummaryReportDto } from './dto/query-task-visit-summary-report.dto';
import { TaskVisitSummaryReportService } from './task-visit-summary-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Task/visit | Task/Visit Summary Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/task-visit/summary-report')
export class TaskVisitSummaryReportController {
  constructor(private readonly service: TaskVisitSummaryReportService) {}

  @Get()
  @Permissions('get_summary_crm_task_visit_summary_report')
  @ApiOperation({ summary: 'Get task/visit counts by user for a date range' })
  getSummary(
    @Query() query: QueryTaskVisitSummaryReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.getSummary(query, currentUser);
  }
}
