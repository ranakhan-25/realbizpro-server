import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuerySourceWiseLeadReportDto } from './dto/query-source-wise-lead-report.dto';
import { SourceWiseLeadReportService } from './source-wise-lead-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Soutch Wish Lead Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/source-wise-leads')
export class SourceWiseLeadReportController {
  constructor(private readonly service: SourceWiseLeadReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_source_wise_lead_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_source_wise_lead_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QuerySourceWiseLeadReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
