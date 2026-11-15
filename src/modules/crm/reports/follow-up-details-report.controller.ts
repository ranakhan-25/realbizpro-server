import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFollowUpDetailsReportDto } from './dto/query-follow-up-details-report.dto';
import { FollowUpDetailsReportService } from './follow-up-details-report.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Follow Up Details Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/follow-up-details')
export class FollowUpDetailsReportController {
  constructor(private readonly service: FollowUpDetailsReportService) {}

  @Get('dropdowns')
  @Permissions('list_crm_follow_up_details_report')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_follow_up_details_report')
  @ApiOperation({ summary: 'Generate report data' })
  list(
    @Query() query: QueryFollowUpDetailsReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.list(query, currentUser);
  }
}
