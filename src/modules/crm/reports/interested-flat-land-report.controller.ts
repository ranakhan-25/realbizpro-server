import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryInterestedFlatLandReportDto } from './dto/query-interested-flat-land-report.dto';
import { InterestedFlatLandReportService } from './interested-flat-land-report.service';

@ApiTags('CRM | Reports | Interested Flat/Land Report')
@ApiBearerAuth()
@Controller('crm/reports/interested-flat-land')
export class InterestedFlatLandReportController {
  constructor(private readonly service: InterestedFlatLandReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get projects and flat/land options for the interested flat/land report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'List interested flat/land requirements with lead, stage, project, flat/land and sourcer' })
  report(@Query() query: QueryInterestedFlatLandReportDto) { return this.service.report(query); }
}
