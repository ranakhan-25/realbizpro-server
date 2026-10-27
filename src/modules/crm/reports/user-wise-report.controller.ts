import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryUserWiseReportDto } from './dto/query-user-wise-report.dto';
import { UserWiseReportService } from './user-wise-report.service';

@ApiTags('CRM | Reports | User Wise Report')
@ApiBearerAuth()
@Controller('crm/reports/user-wise')
export class UserWiseReportController {
  constructor(private readonly service: UserWiseReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get users, lead sources, campaigns and teams for the user wise report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get lead, visit and call/follow-up summaries grouped by user' })
  report(@Query() query: QueryUserWiseReportDto) { return this.service.report(query); }
}
