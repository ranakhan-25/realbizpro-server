import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryUserActivityReportDto } from './dto/query-user-activity-report.dto';
import { UserActivityReportService } from './user-activity-report.service';

@ApiTags('CRM | Reports | User Activity Report')
@ApiBearerAuth()
@Controller('crm/reports/user-activity')
export class UserActivityReportController {
  constructor(private readonly service: UserActivityReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get users, lead stages and visit statuses for the user activity report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get user activity KPIs, lead/visit/follow-up summaries and activity rows' })
  report(@Query() query: QueryUserActivityReportDto) { return this.service.report(query); }
}
