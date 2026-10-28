import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryCallLogReportDto } from './dto/query-call-log-report.dto';
import { CallLogReportService } from './call-log-report.service';

@ApiTags('CRM | Reports | Call Log Report')
@ApiBearerAuth()
@Controller('crm/reports/call-log')
export class CallLogReportController {
  constructor(private readonly service: CallLogReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get active users for the call log report user filter' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get call log summary by user with incoming, outgoing and duration totals' })
  report(@Query() query: QueryCallLogReportDto) { return this.service.report(query); }
}
