import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryCallReportsDto } from './dto/query-call-reports.dto';
import { CallReportsService } from './call-reports.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Call reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/call-reports')
export class CallReportsController {
  constructor(private readonly service: CallReportsService) {}

  @Get()
  @Permissions('get_report_crm_call_reports')
  @ApiOperation({ summary: 'Generate report data' })
  getReport(
    @Query() query: QueryCallReportsDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.getReport(query, currentUser);
  }
}
