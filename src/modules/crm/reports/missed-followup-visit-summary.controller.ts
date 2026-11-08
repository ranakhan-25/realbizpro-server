import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryMissedFollowupVisitSummaryDto } from './dto/query-missed-followup-visit-summary.dto';
import { MissedFollowupVisitSummaryService } from './missed-followup-visit-summary.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Reports | Missed Follow-up & Visit Summary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/reports/missed-followup-visit-summary')
export class MissedFollowupVisitSummaryController {
  constructor(private readonly service: MissedFollowupVisitSummaryService) {}

  @Get('dropdowns')
  @Permissions('list_crm_missed_followup_visit_summary')
  @ApiOperation({ summary: 'Get dropdown options for report filters' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_missed_followup_visit_summary')
  @ApiOperation({ summary: 'Generate report data' })
  report(
    @Query() query: QueryMissedFollowupVisitSummaryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.report(query, currentUser);
  }
}
