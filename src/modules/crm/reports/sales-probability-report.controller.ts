import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuerySalesProbabilityReportDto } from './dto/query-sales-probability-report.dto';
import { SalesProbabilityReportService } from './sales-probability-report.service';

@ApiTags('CRM | Reports | Sales Probability')
@ApiBearerAuth()
@Controller('crm/reports/sales-probability')
export class SalesProbabilityReportController {
  constructor(private readonly service: SalesProbabilityReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get users and lead stages for the sales probability report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'List leads with stage, assigned user and sales probability' })
  report(@Query() query: QuerySalesProbabilityReportDto) { return this.service.report(query); }
}
