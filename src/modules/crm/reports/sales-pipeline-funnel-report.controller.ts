import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuerySalesPipelineFunnelReportDto } from './dto/query-sales-pipeline-funnel-report.dto';
import { SalesPipelineFunnelReportService } from './sales-pipeline-funnel-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Sales Pipeline Funnel Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/sales-pipeline-funnel')
export class SalesPipelineFunnelReportController {
  constructor(private readonly service: SalesPipelineFunnelReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_sales_pipeline_funnel_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_sales_pipeline_funnel_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QuerySalesPipelineFunnelReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
