import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreateInvPurchaseDto } from './dto/create-inv-purchase.dto';
import { UpdateInvPurchaseDto } from './dto/update-inv-purchase.dto';
import { QueryInvPurchaseDto } from './dto/query-inv-purchase.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Purchases')
@ApiBearerAuth()
@Controller('inventory/purchases')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @Permissions('inventory_purchase.create')
  @ApiOperation({ summary: 'Create a new purchase with items' })
  @ApiResponse({ status: 201, description: 'Purchase created successfully.' })
  create(@Body() createDto: CreateInvPurchaseDto) {
    return this.purchaseService.create(createDto);
  }

  @Get()
  @Permissions('inventory_purchase.read')
  @ApiOperation({ summary: 'Get all purchases with pagination and filters' })
  findAll(@Query() query: QueryInvPurchaseDto) {
    return this.purchaseService.findAll(query);
  }

  @Get(':id')
  @Permissions('inventory_purchase.read')
  @ApiOperation({ summary: 'Get a purchase by UUID' })
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id')
  @Permissions('inventory_purchase.update')
  @ApiOperation({ summary: 'Update a purchase (metadata only)' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInvPurchaseDto) {
    return this.purchaseService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_purchase.delete')
  @ApiOperation({ summary: 'Delete a purchase' })
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(id);
  }
}
