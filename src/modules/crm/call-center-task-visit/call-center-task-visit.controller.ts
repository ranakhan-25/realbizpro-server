import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CallCenterTaskVisitService } from './call-center-task-visit.service';
import { QueryTaskVisitDto } from './dto/query-task-visit.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Task/visit | All Visits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/call-center/task-visit')
export class CallCenterTaskVisitController {
  constructor(private readonly service: CallCenterTaskVisitService) {}

  @Get('dropdowns')
  @Permissions('list_crm_call_center_task_visit')
  @ApiOperation({ summary: 'Get active users, visit statuses, visit places, task types, and sales possibility options' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_call_center_task_visit')
  @ApiOperation({ summary: 'List existing visit/task activities with date, user, place, type, search and pagination filters' })
  list(
    @Query() query: QueryTaskVisitDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.list(query, currentUser);
  }
}

@ApiTags('CRM | Task/visit | 1. Task/Visit Details Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/task-visit/details-report')
export class TaskVisitDetailsReportController {
  constructor(private readonly service: CallCenterTaskVisitService) {}

  @Get()
  @Permissions('get_details_crm_task_visit_details_report')
  @ApiOperation({ summary: 'Get task/visit detail rows with date, user, status, place, task type and sales possibility filters' })
  getDetails(
    @Query() query: QueryTaskVisitDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.list(query, currentUser);
  }
}
