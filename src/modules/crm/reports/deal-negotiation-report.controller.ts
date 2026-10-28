import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryDealNegotiationReportDto } from './dto/query-deal-negotiation-report.dto';
import { DealNegotiationReportService } from './deal-negotiation-report.service';

@ApiTags('CRM | Reports | Deal Negotiation Report')
@ApiBearerAuth()
@Controller('crm/reports/deal-negotiation')
export class DealNegotiationReportController {
  constructor(private readonly service: DealNegotiationReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get project, flat/land, lead, activity type, status and creator dropdowns' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'List deal negotiations with all visible negotiation report fields' })
  report(@Query() query: QueryDealNegotiationReportDto) { return this.service.report(query); }
}
