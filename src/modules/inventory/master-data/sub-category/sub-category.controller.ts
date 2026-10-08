import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvSubCategoryService } from './sub-category.service';
import { CreateInvSubCategoryDto } from './dto/create-inv-sub-category.dto';
import { UpdateInvSubCategoryDto } from './dto/update-inv-sub-category.dto';

@ApiTags('Inventory - Master Data: Sub Category')
@Controller('inventory/sub-categories')
export class InvSubCategoryController {
  constructor(private readonly service: InvSubCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory sub-category' })
  @ApiResponse({ status: 201, description: 'The sub-category has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Sub-category code already exists.' })
  async create(@Body() createDto: CreateInvSubCategoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory sub-categories' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific sub-category by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sub-category' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvSubCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sub-category' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
