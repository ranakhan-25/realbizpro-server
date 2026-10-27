import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFollowUpDetailsReportDto } from './dto/query-follow-up-details-report.dto';
import { FollowUpDetailsReportService } from './follow-up-details-report.service';

@ApiTags('CRM | Reports | Follow Up Details Report')
@ApiBearerAuth()
@Controller('crm/reports/follow-up-details')
export class FollowUpDetailsReportController {
  constructor(private readonly service: FollowUpDetailsReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get users, leads, lead stages and communication statuses for follow-up report filters' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'List follow-up details with date, user, stage, lead, project, flat/land, phone, note, comment and status' })
  list(@Query() query: QueryFollowUpDetailsReportDto) { return this.service.list(query); }
}
