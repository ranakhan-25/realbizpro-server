import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryDealNegotiationReportDto } from './dto/query-deal-negotiation-report.dto';
import { DealNegotiationReportService } from './deal-negotiation-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Deal Negotiation Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/deal-negotiation')
export class DealNegotiationReportController {
  constructor(private readonly service: DealNegotiationReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_deal_negotiation_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_deal_negotiation_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryDealNegotiationReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
