import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('LAMS - Final Settlements & Agreements')
@ApiBearerAuth()
@Controller('lams/settlements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SettlementController {
  constructor(private readonly service: SettlementService) {}

  @Post()
  @Permissions('lams_settlements.create')
  @ApiOperation({ summary: 'Create a new settlement record' })
  async create(@Body() createDto: CreateSettlementDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('lams_settlements.read')
  @ApiOperation({ summary: 'Get all settlement records' })
  async findAll(@Query('lead_id') leadId?: string, @Query('org_id') orgId?: string) {
    return this.service.findAll({ lead_id: leadId, org_id: orgId });
  }

  @Get(':uuid')
  @Permissions('lams_settlements.read')
  @ApiOperation({ summary: 'Get a settlement record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the settlement record' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('lams_settlements.update')
  @ApiOperation({ summary: 'Update a settlement record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the settlement record' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateSettlementDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('lams_settlements.delete')
  @ApiOperation({ summary: 'Delete a settlement record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the settlement record' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
