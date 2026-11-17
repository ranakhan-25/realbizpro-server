import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFlatLandSaleReportDto } from './dto/query-flat-land-sale-report.dto';
import { FlatLandSaleReportService } from './flat-land-sale-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Flat/Land Sale Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/flat-land-sales')
export class FlatLandSaleReportController {
  constructor(private readonly service: FlatLandSaleReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_flat_land_sale_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_flat_land_sale_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryFlatLandSaleReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
