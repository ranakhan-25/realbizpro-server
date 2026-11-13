import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AcquisitionLeadService } from './acquisition-lead.service';
import { CreateAcquisitionLeadDto } from './dto/create-acquisition-lead.dto';
import { UpdateAcquisitionLeadDto } from './dto/update-acquisition-lead.dto';
import { AdvanceStageDto, RejectLeadDto } from './dto/advance-stage.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/auth.decorators';

@ApiTags('LAMS - Acquisition Leads')
@ApiBearerAuth()
@Controller('lams/acquisition-leads')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AcquisitionLeadController {
  constructor(private readonly service: AcquisitionLeadService) {}

  @Post()
  @Permissions('lams_acquisition_leads.create')
  @ApiOperation({ summary: 'Create a new acquisition lead' })
  async create(@Body() createDto: CreateAcquisitionLeadDto, @CurrentUser() user: any) {
    return this.service.create(createDto, user);
  }

  @Get()
  @Permissions('lams_acquisition_leads.read')
  @ApiOperation({ summary: 'Get all acquisition leads with filters' })
  async findAll(
    @CurrentUser() user: any,
    @Query('org_id') queryOrgId?: string,
    @Query('lead_status') leadStatus?: string,
    @Query('source') source?: string,
    @Query('assigned_to') assignedTo?: string,
    @Query('search') search?: string,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || queryOrgId;
    return this.service.findAll({
      org_id: orgId,
      lead_status: leadStatus,
      source: source,
      assigned_to: assignedTo,
      search: search,
      from_date: fromDate,
      to_date: toDate,
    });
  }

  @Get(':uuid')
  @Permissions('lams_acquisition_leads.read')
  @ApiOperation({ summary: 'Get an acquisition lead by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the acquisition lead' })
  async findOne(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    return this.service.findOne(uuid, orgId);
  }

  @Put(':uuid')
  @Permissions('lams_acquisition_leads.update')
  @ApiOperation({ summary: 'Update an acquisition lead by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the acquisition lead' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateAcquisitionLeadDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(uuid, updateDto, user);
  }

  @Delete(':uuid')
  @Permissions('lams_acquisition_leads.delete')
  @ApiOperation({ summary: 'Delete an acquisition lead by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the acquisition lead' })
  async remove(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    return this.service.remove(uuid, user);
  }

  @Post(':uuid/advance-stage')
  @Permissions('lams_acquisition_leads.update')
  @ApiOperation({ summary: 'Advance acquisition lead workflow stage with audit remarks' })
  @ApiParam({ name: 'uuid', description: 'UUID of the lead' })
  async advanceStage(
    @Param('uuid') uuid: string,
    @Body() dto: AdvanceStageDto,
    @CurrentUser() user: any,
  ) {
    return this.service.advanceStage(uuid, dto, user);
  }

  @Post(':uuid/qualify')
  @Permissions('lams_acquisition_leads.update')
  @ApiOperation({ summary: 'Qualify acquisition lead for technical and legal evaluation' })
  @ApiParam({ name: 'uuid', description: 'UUID of the lead' })
  async qualify(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    return this.service.qualifyLead(uuid, user);
  }

  @Post(':uuid/reject')
  @Permissions('lams_acquisition_leads.update')
  @ApiOperation({ summary: 'Reject acquisition lead with mandatory rejection reason' })
  @ApiParam({ name: 'uuid', description: 'UUID of the lead' })
  async reject(
    @Param('uuid') uuid: string,
    @Body() dto: RejectLeadDto,
    @CurrentUser() user: any,
  ) {
    return this.service.rejectLead(uuid, dto, user);
  }

  @Get(':uuid/stage-logs')
  @Permissions('lams_acquisition_leads.read')
  @ApiOperation({ summary: 'Get full audit trail of stage transitions for a lead' })
  @ApiParam({ name: 'uuid', description: 'UUID of the lead' })
  async getStageLogs(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    return this.service.getStageLogs(uuid, orgId);
  }
}
