import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CallAssignHistoryService } from './call-assign-history.service';
import { QueryCallAssignHistoryDto } from './dto/query-call-assign-history.dto';

@ApiTags('CRM | Call Center | 1. Call Assign History')
@ApiBearerAuth()
@Controller('crm/call-center/call-assign-history')
export class CallAssignHistoryController {
  constructor(private readonly service: CallAssignHistoryService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get active users for From/To and active communication statuses' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'List call assignment history with lead, user, date, status, search and pagination filters' })
  list(@Query() query: QueryCallAssignHistoryDto) { return this.service.list(query); }
}
