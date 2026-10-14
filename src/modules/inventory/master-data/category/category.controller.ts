import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvCategoryService } from './category.service';
import { CreateInvCategoryDto } from './dto/create-inv-category.dto';
import { UpdateInvCategoryDto } from './dto/update-inv-category.dto';

@ApiTags('Inventory - Master Data: Category')
@Controller('inventory/categories')
export class InvCategoryController {
  constructor(private readonly service: InvCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory category' })
  @ApiResponse({ status: 201, description: 'The category has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Category code already exists.' })
  async create(@Body() createDto: CreateInvCategoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory categories' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific category by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
