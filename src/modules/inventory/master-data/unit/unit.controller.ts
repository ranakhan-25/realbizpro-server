import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvUnitService } from './unit.service';
import { CreateInvUnitDto } from './dto/create-inv-unit.dto';
import { UpdateInvUnitDto } from './dto/update-inv-unit.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Master Data: Unit')
@ApiBearerAuth()
@Controller('inventory/units')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvUnitController {
  constructor(private readonly service: InvUnitService) {}

  @Post()
  @Permissions('inventory_products_units.create')
  @ApiOperation({ summary: 'Create a new unit' })
  @ApiResponse({ status: 201, description: 'The unit has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Unit code already exists.' })
  async create(@Body() createDto: CreateInvUnitDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('inventory_products_units.read')
  @ApiOperation({ summary: 'Get all units' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('inventory_products_units.read')
  @ApiOperation({ summary: 'Get a specific unit by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Permissions('inventory_products_units.update')
  @ApiOperation({ summary: 'Update a unit' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvUnitDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_products_units.delete')
  @ApiOperation({ summary: 'Delete a unit' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
