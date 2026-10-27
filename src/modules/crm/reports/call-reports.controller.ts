import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryCallReportsDto } from './dto/query-call-reports.dto';
import { CallReportsService } from './call-reports.service';

@ApiTags('CRM | Reports | Call reports')
@ApiBearerAuth()
@Controller('crm/reports/call-reports')
export class CallReportsController {
  constructor(private readonly service: CallReportsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get call report summaries by user/status, date/status, and date/user',
  })
  getReport(@Query() query: QueryCallReportsDto) {
    return this.service.getReport(query);
  }
}
