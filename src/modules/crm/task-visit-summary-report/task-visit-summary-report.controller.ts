import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryTaskVisitSummaryReportDto } from './dto/query-task-visit-summary-report.dto';
import { TaskVisitSummaryReportService } from './task-visit-summary-report.service';

@ApiTags('CRM | Task/visit | Task/Visit Summary Report')
@ApiBearerAuth()
@Controller('crm/task-visit/summary-report')
export class TaskVisitSummaryReportController {
  constructor(private readonly service: TaskVisitSummaryReportService) {}

  @Get()
  @ApiOperation({ summary: 'Get task/visit counts by user for a date range' })
  getSummary(@Query() query: QueryTaskVisitSummaryReportDto) {
    return this.service.getSummary(query);
  }
}
