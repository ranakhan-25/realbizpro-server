import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrReportsService } from './cr-reports.service';

@ApiTags('Credit Realization - Reports & Aging Analysis')
@Controller('credit-realization/reports')
export class CrReportsController {
  constructor(private readonly service: CrReportsService) {}

  @Get('aging-analysis')
  @ApiOperation({
    summary:
      'Get 5-bucket aging matrix (0-30, 31-60, 61-90, 91-120, 120+ days) with overdue amounts',
  })
  async getAgingAnalysis() {
    return this.service.getAgingAnalysis();
  }

  @Get('overdue-summary')
  @ApiOperation({ summary: 'Get macro overview of overdue principal vs penalties' })
  async getOverdueSummary() {
    return this.service.getOverdueSummary();
  }

  @Get('collection-summary')
  @ApiOperation({ summary: 'Get total payment collections categorized by payment method' })
  async getCollectionSummary() {
    return this.service.getCollectionSummary();
  }
}
