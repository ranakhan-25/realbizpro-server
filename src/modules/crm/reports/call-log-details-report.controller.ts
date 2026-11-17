import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryCallLogDetailsReportDto } from './dto/query-call-log-details-report.dto';
import { CallLogDetailsReportService } from './call-log-details-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Call Log Details Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/call-log-details')
export class CallLogDetailsReportController {
  constructor(private readonly service: CallLogDetailsReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_call_log_details_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_call_log_details_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryCallLogDetailsReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
