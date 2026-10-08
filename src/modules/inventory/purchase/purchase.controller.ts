import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreateInvPurchaseDto } from './dto/create-inv-purchase.dto';
import { UpdateInvPurchaseDto } from './dto/update-inv-purchase.dto';
import { QueryInvPurchaseDto } from './dto/query-inv-purchase.dto';

@ApiTags('Inventory - Purchases')
@Controller('inventory/purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase with items' })
  @ApiResponse({ status: 201, description: 'Purchase created successfully.' })
  create(@Body() createDto: CreateInvPurchaseDto) {
    return this.purchaseService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchases with pagination and filters' })
  findAll(@Query() query: QueryInvPurchaseDto) {
    return this.purchaseService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase by UUID' })
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a purchase (metadata only)' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInvPurchaseDto) {
    return this.purchaseService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a purchase' })
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(id);
  }
}
