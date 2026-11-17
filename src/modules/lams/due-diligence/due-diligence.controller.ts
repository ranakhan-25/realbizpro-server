import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { DueDiligenceService } from './due-diligence.service';
import { CreateDueDiligenceDto } from './dto/create-due-diligence.dto';
import { UpdateDueDiligenceDto } from './dto/update-due-diligence.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('LAMS - Due Diligence')
@ApiBearerAuth()
@Controller('lams/due-diligences')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DueDiligenceController {
  constructor(private readonly service: DueDiligenceService) {}

  @Post()
  @Permissions('lams_due_diligence.create')
  @ApiOperation({ summary: 'Create a new due diligence record' })
  async create(@Body() createDto: CreateDueDiligenceDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('lams_due_diligence.read')
  @ApiOperation({ summary: 'Get all due diligence records' })
  async findAll(@Query('lead_id') leadId?: string, @Query('org_id') orgId?: string) {
    return this.service.findAll({ lead_id: leadId, org_id: orgId });
  }

  @Get(':uuid')
  @Permissions('lams_due_diligence.read')
  @ApiOperation({ summary: 'Get a due diligence record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the due diligence record' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('lams_due_diligence.update')
  @ApiOperation({ summary: 'Update a due diligence record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the due diligence record' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateDueDiligenceDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('lams_due_diligence.delete')
  @ApiOperation({ summary: 'Delete a due diligence record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the due diligence record' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
