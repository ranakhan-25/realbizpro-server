import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ValuationService } from './valuation.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('LAMS - Land Valuation')
@ApiBearerAuth()
@Controller('lams/valuations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ValuationController {
  constructor(private readonly service: ValuationService) {}

  @Post()
  @Permissions('lams_land_valuation.create')
  @ApiOperation({ summary: 'Create a new land valuation record' })
  async create(@Body() createDto: CreateValuationDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('lams_land_valuation.read')
  @ApiOperation({ summary: 'Get all land valuations' })
  async findAll(@Query('lead_id') leadId?: string, @Query('org_id') orgId?: string) {
    return this.service.findAll({ lead_id: leadId, org_id: orgId });
  }

  @Get(':uuid')
  @Permissions('lams_land_valuation.read')
  @ApiOperation({ summary: 'Get a valuation record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the valuation record' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('lams_land_valuation.update')
  @ApiOperation({ summary: 'Update a valuation record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the valuation record' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateValuationDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('lams_land_valuation.delete')
  @ApiOperation({ summary: 'Delete a valuation record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the valuation record' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
