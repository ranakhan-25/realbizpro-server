import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CrReportsService } from './cr-reports.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Credit Realization - Reports & Aging Analysis')
@ApiBearerAuth()
@Controller('credit-realization/reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrReportsController {
  constructor(private readonly service: CrReportsService) {}

  @Get('aging-analysis')
  @Permissions('credit-realization:read')
  @ApiOperation({
    summary:
      'Get 5-bucket aging matrix (0-30, 31-60, 61-90, 91-120, 120+ days) with overdue amounts',
  })
  async getAgingAnalysis(@Req() req: any) {
    const orgId = req.user?.org_id || req.user?.organization_id;
    return this.service.getAgingAnalysis(orgId);
  }

  @Get('overdue-summary')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get macro overview of overdue principal vs penalties' })
  async getOverdueSummary(@Req() req: any) {
    const orgId = req.user?.org_id || req.user?.organization_id;
    return this.service.getOverdueSummary(orgId);
  }

  @Get('collection-summary')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get total payment collections categorized by payment method' })
  async getCollectionSummary(@Req() req: any) {
    const orgId = req.user?.org_id || req.user?.organization_id;
    return this.service.getCollectionSummary(orgId);
  }

  @Get('officer-performance')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get officer target quotas vs actual collections leaderboard' })
  async getOfficerPerformance(@Req() req: any) {
    const orgId = req.user?.org_id || req.user?.organization_id;
    return this.service.getOfficerPerformance(orgId);
  }

  @Get('defaulters-leaderboard')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get top overdue debtors list with recovery interaction logs' })
  async getDefaultersLeaderboard(@Req() req: any) {
    const orgId = req.user?.org_id || req.user?.organization_id;
    return this.service.getDefaultersLeaderboard(orgId);
  }
}
