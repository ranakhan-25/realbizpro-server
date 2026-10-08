import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvBrandService } from './brand.service';
import { CreateInvBrandDto } from './dto/create-inv-brand.dto';
import { UpdateInvBrandDto } from './dto/update-inv-brand.dto';

@ApiTags('Inventory - Master Data: Brand')
@Controller('inventory/brands')
export class InvBrandController {
  constructor(private readonly service: InvBrandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'The brand has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Brand code already exists.' })
  async create(@Body() createDto: CreateInvBrandDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific brand by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a brand' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvBrandDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
