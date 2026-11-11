import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Warehouses')
@ApiBearerAuth()
@Controller('inventory/warehouses')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Post()
  @Permissions('inventory_warehouses.create')
  @ApiOperation({ summary: 'Create a new warehouse' })
  async create(@Body() createDto: CreateWarehouseDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('inventory_warehouses.read')
  @ApiOperation({ summary: 'Get all warehouses' })
  async findAll(@Query('org_id') orgId?: string, @Query('is_active') isActive?: string) {
    const active = isActive !== undefined ? isActive === 'true' : undefined;
    return this.service.findAll({ org_id: orgId, is_active: active });
  }

  @Get(':id')
  @Permissions('inventory_warehouses.read')
  @ApiOperation({ summary: 'Get a warehouse by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the warehouse' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Permissions('inventory_warehouses.update')
  @ApiOperation({ summary: 'Update a warehouse by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the warehouse' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateWarehouseDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_warehouses.delete')
  @ApiOperation({ summary: 'Delete a warehouse by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the warehouse' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
