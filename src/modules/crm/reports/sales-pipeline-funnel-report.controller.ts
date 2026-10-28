import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuerySalesPipelineFunnelReportDto } from './dto/query-sales-pipeline-funnel-report.dto';
import { SalesPipelineFunnelReportService } from './sales-pipeline-funnel-report.service';

@ApiTags('CRM | Reports | Sales Pipeline Funnel Report')
@ApiBearerAuth()
@Controller('crm/reports/sales-pipeline-funnel')
export class SalesPipelineFunnelReportController {
  constructor(private readonly service: SalesPipelineFunnelReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get users, teams and projects for the sales pipeline funnel filters' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'Get sales pipeline funnel cards, funnel stages and pipeline details' })
  report(@Query() query: QuerySalesPipelineFunnelReportDto) { return this.service.report(query); }
}
