import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryCallLogDetailsReportDto } from './dto/query-call-log-details-report.dto';
import { CallLogDetailsReportService } from './call-log-details-report.service';

@ApiTags('CRM | Reports | Call Log Details Report')
@ApiBearerAuth()
@Controller('crm/reports/call-log-details')
export class CallLogDetailsReportController {
  constructor(private readonly service: CallLogDetailsReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get active users for the call log details user filter' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get detailed call logs with date, user, number, name, call type and duration' })
  report(@Query() query: QueryCallLogDetailsReportDto) { return this.service.report(query); }
}
