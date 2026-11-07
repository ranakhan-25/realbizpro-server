import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuerySalesProbabilityReportDto } from './dto/query-sales-probability-report.dto';
import { SalesProbabilityReportService } from './sales-probability-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Sales Probability Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/sales-probability')
export class SalesProbabilityReportController {
  constructor(private readonly service: SalesProbabilityReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_sales_probability_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_sales_probability_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QuerySalesProbabilityReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
