import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/auth.decorators';
import { CustomerServiceChangeRequestsService } from './customer-service-change-requests.service';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { UpdateChangeRequestDto } from './dto/update-change-request.dto';
import { QueryChangeRequestDto } from './dto/query-change-request.dto';
import { AdvanceChangeRequestDto } from './dto/advance-change-request.dto';
import { UpdateStatusChangeRequestDto } from './dto/update-status-change-request.dto';

@ApiTags('Customer Service | Change Requests')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  CustomerServiceTenantGuard,
)
@Controller('customer-service/change-requests')
export class CustomerServiceChangeRequestsController {
  constructor(
    private readonly changeRequestsService: CustomerServiceChangeRequestsService,
  ) {}

  // 1. Static Route: KPI Overview Stats (Declared BEFORE /:uuid)
  @Get('stats')
  @ApiOperation({
    summary:
      'Get Change Requests KPI metrics (single aggregation query)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change request stats calculated successfully',
  })
  getStats(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.changeRequestsService.getStats(
      projectId,
      user,
    );
  }

  // 2. Static Route: Dropdown Metadata (Declared BEFORE /:uuid)
  @Get('dropdown/meta')
  @ApiOperation({
    summary:
      'Get dropdown metadata (request types, statuses, workflow stages)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Dropdown metadata retrieved successfully',
  })
  getDropdownMeta() {
    return this.changeRequestsService.getDropdownMeta();
  }

  // 3. Collection Route: Paginated List with Search, Tabs, and Filter
  @Get()
  @ApiOperation({
    summary:
      'List customer change requests with search, tab counts, and pagination',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change requests list retrieved successfully',
  })
  findChangeRequests(
    @Query() query: QueryChangeRequestDto,
    @CurrentUser() user?: any,
  ) {
    return this.changeRequestsService.findChangeRequests(
      query,
      user,
    );
  }

  // 4. Create New Change Request
  @Post()
  @ApiOperation({
    summary:
      'Initiate a new change request / ownership transfer application',
  })
  @ApiResponse({
    status: 201,
    description:
      'Change request initiated successfully',
  })
  createChangeRequest(
    @Body() dto: CreateChangeRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.changeRequestsService.createChangeRequest(
      dto,
      user,
    );
  }

  // 5. Param Route: Detail by UUID
  @Get(':uuid')
  @ApiOperation({
    summary:
      'Get single change request detail by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Change request UUID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change request retrieved successfully',
  })
  findByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.changeRequestsService.findByUuid(
      uuid,
      user,
    );
  }

  // 6. Update Change Request Fields
  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update change request details',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Change request UUID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change request updated successfully',
  })
  updateChangeRequest(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChangeRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.changeRequestsService.updateChangeRequest(
      uuid,
      dto,
      user,
    );
  }

  // 7. Advance Workflow Pipeline Stage
  @Patch(':uuid/advance')
  @ApiOperation({
    summary:
      'Advance change request to the next workflow stage (Legal -> HOD -> Accounts -> Completed)',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Change request UUID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change request stage advanced successfully',
  })
  advanceStatus(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: AdvanceChangeRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.changeRequestsService.advanceStatus(
      uuid,
      dto,
      user,
    );
  }

  // 8. Update Workflow Status Directly (e.g. Reject or Jump)
  @Patch(':uuid/status')
  @ApiOperation({
    summary:
      'Set change request workflow status directly (e.g. Reject)',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Change request UUID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change request status updated successfully',
  })
  updateStatus(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateStatusChangeRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.changeRequestsService.updateStatus(
      uuid,
      dto,
      user,
    );
  }

  // 9. Soft Delete Change Request
  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft-delete a customer change request',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Change request UUID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change request soft-deleted successfully',
  })
  removeChangeRequest(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user: any,
  ) {
    return this.changeRequestsService.removeChangeRequest(
      uuid,
      user,
    );
  }

  // 10. Restore Soft-Deleted Change Request (PATCH)
  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore a soft-deleted customer change request',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Change request UUID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change request restored successfully',
  })
  restoreChangeRequest(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user: any,
  ) {
    return this.changeRequestsService.restoreChangeRequest(
      uuid,
      user,
    );
  }

  // 11. Restore Soft-Deleted Change Request (POST Alternative)
  @Post(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore a soft-deleted customer change request (POST alternative)',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Change request UUID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Change request restored successfully',
  })
  restoreChangeRequestPost(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user: any,
  ) {
    return this.changeRequestsService.restoreChangeRequest(
      uuid,
      user,
    );
  }
}
