import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CallAssignHistoryService } from './call-assign-history.service';
import { QueryCallAssignHistoryDto } from './dto/query-call-assign-history.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags(
  'CRM | Call Center | 1. Call Assign History',
)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/call-center/call-assign-history')
export class CallAssignHistoryController {
  constructor(
    private readonly service: CallAssignHistoryService,
  ) {}

  @Get('dropdowns')
  @Permissions('list_crm_call_assign_history')
  @ApiOperation({
    summary:
      'Get active users for From/To and active communication statuses',
  })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get()
  @Permissions('list_crm_call_assign_history')
  @ApiOperation({
    summary:
      'List call assignment history with lead, user, date, status, search and pagination filters',
  })
  list(
    @Query() query: QueryCallAssignHistoryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.list(query, currentUser);
  }
}
