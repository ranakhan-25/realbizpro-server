import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvBrandService } from './brand.service';
import { CreateInvBrandDto } from './dto/create-inv-brand.dto';
import { UpdateInvBrandDto } from './dto/update-inv-brand.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Master Data: Brand')
@ApiBearerAuth()
@Controller('inventory/brands')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvBrandController {
  constructor(private readonly service: InvBrandService) {}

  @Post()
  @Permissions('inventory_products_brands.create')
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'The brand has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Brand code already exists.' })
  async create(@Body() createDto: CreateInvBrandDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('inventory_products_brands.read')
  @ApiOperation({ summary: 'Get all brands' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('inventory_products_brands.read')
  @ApiOperation({ summary: 'Get a specific brand by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Permissions('inventory_products_brands.update')
  @ApiOperation({ summary: 'Update a brand' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvBrandDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_products_brands.delete')
  @ApiOperation({ summary: 'Delete a brand' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
