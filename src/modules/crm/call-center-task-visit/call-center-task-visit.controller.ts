import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CallCenterTaskVisitService } from './call-center-task-visit.service';
import { QueryTaskVisitDto } from './dto/query-task-visit.dto';
@ApiTags('CRM | Task/visit | All Visits')
@ApiBearerAuth()
@Controller('crm/call-center/task-visit')
export class CallCenterTaskVisitController {
  constructor(private readonly service: CallCenterTaskVisitService) {}
  @Get('dropdowns') @ApiOperation({ summary: 'Get active users, visit statuses, visit places, task types, and sales possibility options' }) dropdowns() { return this.service.dropdowns(); }
  @Get() @ApiOperation({ summary: 'List existing visit/task activities with date, user, place, type, search and pagination filters' }) list(@Query() query: QueryTaskVisitDto) { return this.service.list(query); }
}

@ApiTags('CRM | Task/visit | 1. Task/Visit Details Report')
@ApiBearerAuth()
@Controller('crm/task-visit/details-report')
export class TaskVisitDetailsReportController {
  constructor(private readonly service: CallCenterTaskVisitService) {}

  @Get()
  @ApiOperation({ summary: 'Get task/visit detail rows with date, user, status, place, task type and sales possibility filters' })
  getDetails(@Query() query: QueryTaskVisitDto) {
    return this.service.list(query);
  }
}
