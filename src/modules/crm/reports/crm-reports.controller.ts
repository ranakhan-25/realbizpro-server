import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrmReportsService } from './crm-reports.service';

@ApiTags('CRM - Reports & Analytics')
@Controller('crm/reports')
export class CrmReportsController {
  constructor(private readonly reportsService: CrmReportsService) {}

  @Get('lead-funnel')
  @ApiOperation({ summary: 'Get CRM lead pipeline funnel & conversion metrics' })
  async getLeadFunnel() {
    return this.reportsService.getLeadFunnel();
  }

  @Get('source-performance')
  @ApiOperation({ summary: 'Get lead distribution by acquisition source' })
  async getSourcePerformance() {
    return this.reportsService.getSourcePerformance();
  }

  @Get('team-productivity')
  @ApiOperation({ summary: 'Get team sales productivity, calls and negotiations metrics' })
  async getTeamProductivity() {
    return this.reportsService.getTeamProductivity();
  }
}
