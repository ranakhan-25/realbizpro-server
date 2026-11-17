import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryInterestedFlatLandReportDto } from './dto/query-interested-flat-land-report.dto';
import { InterestedFlatLandReportService } from './interested-flat-land-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Interested Flat/Land Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/interested-flat-land')
export class InterestedFlatLandReportController {
  constructor(private readonly service: InterestedFlatLandReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_interested_flat_land_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_interested_flat_land_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryInterestedFlatLandReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
