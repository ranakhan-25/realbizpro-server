import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { StockCountService } from './stock-count.service';
import { CreateStockCountDto } from './dto/create-stock-count.dto';
import { UpdateStockCountDto } from './dto/update-stock-count.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Physical Stock Counts')
@ApiBearerAuth()
@Controller('inventory/stock-counts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StockCountController {
  constructor(private readonly service: StockCountService) {}

  @Post()
  @Permissions('inventory_stock_counts.create')
  @ApiOperation({ summary: 'Create a new stock count' })
  async create(@Body() createDto: CreateStockCountDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('inventory_stock_counts.read')
  @ApiOperation({ summary: 'Get all stock counts' })
  async findAll(@Query('warehouse_id') warehouseId?: number, @Query('org_id') orgId?: string) {
    return this.service.findAll({ warehouse_id: warehouseId, org_id: orgId });
  }

  @Get(':id')
  @Permissions('inventory_stock_counts.read')
  @ApiOperation({ summary: 'Get a stock count by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the stock count' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Permissions('inventory_stock_counts.update')
  @ApiOperation({ summary: 'Update a stock count by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the stock count' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateStockCountDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_stock_counts.delete')
  @ApiOperation({ summary: 'Delete a stock count by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the stock count' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
