import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryUserWiseReportDto } from './dto/query-user-wise-report.dto';
import { UserWiseReportService } from './user-wise-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | User Wise Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/user-wise')
export class UserWiseReportController {
  constructor(private readonly service: UserWiseReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_user_wise_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_user_wise_report')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryUserWiseReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
