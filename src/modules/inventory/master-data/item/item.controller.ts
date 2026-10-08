import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvItemService } from './item.service';
import { CreateInvItemDto } from './dto/create-inv-item.dto';
import { UpdateInvItemDto } from './dto/update-inv-item.dto';

@ApiTags('Inventory - Master Data: Item')
@Controller('inventory/items')
export class InvItemController {
  constructor(private readonly service: InvItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Item code already exists.' })
  async create(@Body() createDto: CreateInvItemDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory items' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific item by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an item' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvItemDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
