import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('LAMS - Acquisition Approvals')
@ApiBearerAuth()
@Controller('lams/approvals')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ApprovalController {
  constructor(private readonly service: ApprovalService) {}

  @Post()
  @Permissions('lams_acquisition_approvals.create')
  @ApiOperation({ summary: 'Create or record an acquisition approval' })
  async create(@Body() createDto: CreateApprovalDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('lams_acquisition_approvals.read')
  @ApiOperation({ summary: 'Get all acquisition approvals' })
  async findAll(@Query('lead_id') leadId?: string, @Query('org_id') orgId?: string) {
    return this.service.findAll({ lead_id: leadId, org_id: orgId });
  }

  @Get(':uuid')
  @Permissions('lams_acquisition_approvals.read')
  @ApiOperation({ summary: 'Get an approval record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the approval record' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('lams_acquisition_approvals.update')
  @ApiOperation({ summary: 'Update an approval record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the approval record' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateApprovalDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('lams_acquisition_approvals.delete')
  @ApiOperation({ summary: 'Delete an approval record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the approval record' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
