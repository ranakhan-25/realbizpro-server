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
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CustomerServiceHandoverService } from './customer-service-handover.service';
import {
  CreateHandoverScheduleDto,
  UpdateHandoverScheduleDto,
  QueryHandoverScheduleDto,
  CreateSnagDto,
  UpdateSnagDto,
  QuerySnagDto,
  CreatePossessionRecordDto,
  UpdatePossessionRecordDto,
} from './dto';

@ApiTags('Customer Service - Handover & Possession')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-organization-id',
  required: false,
  description: 'Target organization ID for Super Admin multi-tenancy override',
})
@UseGuards(JwtAuthGuard, CustomerServiceTenantGuard)
@Controller('customer-service/handover')
export class CustomerServiceHandoverController {
  constructor(
    private readonly handoverService: CustomerServiceHandoverService,
  ) {}

  // =========================================================================
  // 1. HANDOVER SCHEDULE & READINESS ENDPOINTS
  // =========================================================================

  @Get('schedule/stats')
  @ApiOperation({ summary: 'Get summary metrics for Handover Scheduling & Readiness' })
  @ApiResponse({ status: 200, description: 'Handover schedule statistics' })
  getScheduleStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.handoverService.getScheduleStats(user, projectId);
  }

  @Get('schedule')
  @ApiOperation({ summary: 'List and filter Handover Schedule items with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated handover schedule records' })
  getScheduleList(
    @CurrentUser() user: any,
    @Query() query: QueryHandoverScheduleDto,
  ) {
    return this.handoverService.getScheduleList(user, query);
  }

  @Post('schedule')
  @ApiOperation({ summary: 'Create a new Handover Schedule entry' })
  @ApiResponse({ status: 201, description: 'Handover entry created successfully' })
  createSchedule(
    @CurrentUser() user: any,
    @Body() dto: CreateHandoverScheduleDto,
  ) {
    return this.handoverService.createSchedule(user, dto);
  }

  @Get('schedule/:uuid')
  @ApiOperation({ summary: 'Get details of a specific Handover record by UUID' })
  @ApiResponse({ status: 200, description: 'Handover schedule details' })
  getScheduleByUuid(
    @CurrentUser() user: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.handoverService.findScheduleByUuid(user, uuid);
  }

  @Patch('schedule/:uuid')
  @ApiOperation({ summary: 'Update handover readiness or lifecycle status' })
  @ApiResponse({ status: 200, description: 'Handover schedule updated successfully' })
  updateSchedule(
    @CurrentUser() user: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateHandoverScheduleDto,
  ) {
    return this.handoverService.updateSchedule(user, uuid, dto);
  }

  @Delete('schedule/:uuid')
  @ApiOperation({ summary: 'Delete a Handover Schedule entry (soft delete)' })
  @ApiResponse({ status: 200, description: 'Handover schedule deleted' })
  deleteSchedule(
    @CurrentUser() user: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.handoverService.deleteSchedule(user, uuid);
  }

  // =========================================================================
  // 2. JOINT INSPECTIONS & SNAGS ENDPOINTS
  // =========================================================================

  @Get('snags/stats')
  @ApiOperation({ summary: 'Get summary metrics for Joint Inspections & Snagging' })
  @ApiResponse({ status: 200, description: 'Snag statistics' })
  getSnagStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.handoverService.getSnagStats(user, projectId);
  }

  @Get('snags')
  @ApiOperation({ summary: 'List and filter snag items with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated snag records' })
  getSnagList(
    @CurrentUser() user: any,
    @Query() query: QuerySnagDto,
  ) {
    return this.handoverService.getSnagList(user, query);
  }

  @Post('snags')
  @ApiOperation({ summary: 'Log a new defect / snag item' })
  @ApiResponse({ status: 201, description: 'Snag item logged successfully' })
  createSnag(
    @CurrentUser() user: any,
    @Body() dto: CreateSnagDto,
  ) {
    return this.handoverService.createSnag(user, dto);
  }

  @Patch('snags/:uuid/advance')
  @ApiOperation({ summary: 'Advance snag rectification status to the next stage' })
  @ApiResponse({ status: 200, description: 'Snag status advanced' })
  advanceSnag(
    @CurrentUser() user: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.handoverService.advanceSnag(user, uuid);
  }

  @Patch('snags/:uuid')
  @ApiOperation({ summary: 'Update defect details, contractor, or status' })
  @ApiResponse({ status: 200, description: 'Snag item updated' })
  updateSnag(
    @CurrentUser() user: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateSnagDto,
  ) {
    return this.handoverService.updateSnag(user, uuid, dto);
  }

  @Delete('snags/:uuid')
  @ApiOperation({ summary: 'Delete a snag item' })
  @ApiResponse({ status: 200, description: 'Snag item deleted' })
  deleteSnag(
    @CurrentUser() user: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.handoverService.deleteSnag(user, uuid);
  }

  // =========================================================================
  // 3. POSSESSION CERTIFICATES & KEY HANDOVER ENDPOINTS
  // =========================================================================

  @Get('possession-records/stats')
  @ApiOperation({ summary: 'Get summary metrics for Possession Certificates & Key Handover' })
  @ApiResponse({ status: 200, description: 'Possession records statistics' })
  getPossessionStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.handoverService.getPossessionStats(user, projectId);
  }

  @Get('possession-records')
  @ApiOperation({ summary: 'List and filter Possession & Key Handover records' })
  @ApiResponse({ status: 200, description: 'Paginated possession records' })
  getPossessionList(
    @CurrentUser() user: any,
    @Query() query: QueryHandoverScheduleDto,
  ) {
    return this.handoverService.getPossessionList(user, query);
  }

  @Post('possession-records')
  @ApiOperation({ summary: 'Issue a new Possession Certificate & record Key Delivery' })
  @ApiResponse({ status: 201, description: 'Possession record created successfully' })
  createPossessionRecord(
    @CurrentUser() user: any,
    @Body() dto: CreatePossessionRecordDto,
  ) {
    return this.handoverService.createPossessionRecord(user, dto);
  }

  @Patch('possession-records/:uuid')
  @ApiOperation({ summary: 'Update Possession Certificate or Meter Readings' })
  @ApiResponse({ status: 200, description: 'Possession record updated successfully' })
  updatePossessionRecord(
    @CurrentUser() user: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePossessionRecordDto,
  ) {
    return this.handoverService.updatePossessionRecord(user, uuid, dto);
  }
}
