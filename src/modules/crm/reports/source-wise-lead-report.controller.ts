import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuerySourceWiseLeadReportDto } from './dto/query-source-wise-lead-report.dto';
import { SourceWiseLeadReportService } from './source-wise-lead-report.service';

@ApiTags('CRM | Reports | Soutch Wish Lead Reports')
@ApiBearerAuth()
@Controller('crm/reports/source-wise-leads')
export class SourceWiseLeadReportController {
  constructor(private readonly service: SourceWiseLeadReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get users and lead sources for the source wise lead report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get source wise lead counts grouped by user with junk and total columns' })
  report(@Query() query: QuerySourceWiseLeadReportDto) { return this.service.report(query); }
}
