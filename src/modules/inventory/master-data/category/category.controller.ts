import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvCategoryService } from './category.service';
import { CreateInvCategoryDto } from './dto/create-inv-category.dto';
import { UpdateInvCategoryDto } from './dto/update-inv-category.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Master Data: Category')
@ApiBearerAuth()
@Controller('inventory/categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvCategoryController {
  constructor(private readonly service: InvCategoryService) {}

  @Post()
  @Permissions('inventory_products_categories.create')
  @ApiOperation({ summary: 'Create a new inventory category' })
  @ApiResponse({ status: 201, description: 'The category has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Category code already exists.' })
  async create(@Body() createDto: CreateInvCategoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('inventory_products_categories.read')
  @ApiOperation({ summary: 'Get all inventory categories' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('inventory_products_categories.read')
  @ApiOperation({ summary: 'Get a specific category by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Permissions('inventory_products_categories.update')
  @ApiOperation({ summary: 'Update a category' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_products_categories.delete')
  @ApiOperation({ summary: 'Delete a category' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
