import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvItemService } from './item.service';
import { CreateInvItemDto } from './dto/create-inv-item.dto';
import { UpdateInvItemDto } from './dto/update-inv-item.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Master Data: Item')
@ApiBearerAuth()
@Controller('inventory/items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvItemController {
  constructor(private readonly service: InvItemService) {}

  @Post()
  @Permissions('inventory_products.create')
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Item code already exists.' })
  async create(@Body() createDto: CreateInvItemDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('inventory_products.read')
  @ApiOperation({ summary: 'Get all inventory items' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('inventory_products.read')
  @ApiOperation({ summary: 'Get a specific item by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Permissions('inventory_products.update')
  @ApiOperation({ summary: 'Update an item' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvItemDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_products.delete')
  @ApiOperation({ summary: 'Delete an item' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
