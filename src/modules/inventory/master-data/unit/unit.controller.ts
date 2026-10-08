import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvUnitService } from './unit.service';
import { CreateInvUnitDto } from './dto/create-inv-unit.dto';
import { UpdateInvUnitDto } from './dto/update-inv-unit.dto';

@ApiTags('Inventory - Master Data: Unit')
@Controller('inventory/units')
export class InvUnitController {
  constructor(private readonly service: InvUnitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new unit' })
  @ApiResponse({ status: 201, description: 'The unit has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Unit code already exists.' })
  async create(@Body() createDto: CreateInvUnitDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific unit by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a unit' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvUnitDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a unit' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
