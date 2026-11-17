import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvSubCategoryService } from './sub-category.service';
import { CreateInvSubCategoryDto } from './dto/create-inv-sub-category.dto';
import { UpdateInvSubCategoryDto } from './dto/update-inv-sub-category.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Master Data: Sub Category')
@ApiBearerAuth()
@Controller('inventory/sub-categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvSubCategoryController {
  constructor(private readonly service: InvSubCategoryService) {}

  @Post()
  @Permissions('inventory_products_sub_categories.create')
  @ApiOperation({ summary: 'Create a new inventory sub-category' })
  @ApiResponse({ status: 201, description: 'The sub-category has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Sub-category code already exists.' })
  async create(@Body() createDto: CreateInvSubCategoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('inventory_products_sub_categories.read')
  @ApiOperation({ summary: 'Get all inventory sub-categories' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('inventory_products_sub_categories.read')
  @ApiOperation({ summary: 'Get a specific sub-category by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Permissions('inventory_products_sub_categories.update')
  @ApiOperation({ summary: 'Update a sub-category' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvSubCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_products_sub_categories.delete')
  @ApiOperation({ summary: 'Delete a sub-category' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
