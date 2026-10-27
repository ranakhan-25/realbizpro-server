import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFlatLandSaleReportDto } from './dto/query-flat-land-sale-report.dto';
import { FlatLandSaleReportService } from './flat-land-sale-report.service';

@ApiTags('CRM | Reports | Flat/Land Sale Report')
@ApiBearerAuth()
@Controller('crm/reports/flat-land-sales')
export class FlatLandSaleReportController {
  constructor(private readonly service: FlatLandSaleReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get sales people, project teams and projects for the flat/land sale report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'List flat/land sales with complete financial, agreement and handover details' })
  report(@Query() query: QueryFlatLandSaleReportDto) { return this.service.report(query); }
}
