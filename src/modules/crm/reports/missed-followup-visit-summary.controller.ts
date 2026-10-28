import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryMissedFollowupVisitSummaryDto } from './dto/query-missed-followup-visit-summary.dto';
import { MissedFollowupVisitSummaryService } from './missed-followup-visit-summary.service';

@ApiTags('CRM | Reports | Missed FollowUp/Visit Summary')
@ApiBearerAuth()
@Controller('crm/reports/missed-followup-visit-summary')
export class MissedFollowupVisitSummaryController {
  constructor(private readonly service: MissedFollowupVisitSummaryService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get active teams and users for the missed follow-up/visit summary' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get missed follow-ups, missed visits and new leads grouped by team employee' })
  report(@Query() query: QueryMissedFollowupVisitSummaryDto) { return this.service.report(query); }
}
