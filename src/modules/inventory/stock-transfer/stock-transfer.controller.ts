import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StockTransferService } from './stock-transfer.service';
import { CreateInvStockTransferDto } from './dto/create-inv-stock-transfer.dto';
import { UpdateInvStockTransferDto } from './dto/update-inv-stock-transfer.dto';
import { QueryInvStockTransferDto } from './dto/query-inv-stock-transfer.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Stock Transfer')
@ApiBearerAuth()
@Controller('inventory/stock-transfers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StockTransferController {
  constructor(private readonly transferService: StockTransferService) {}

  @Post()
  @Permissions('inventory_adjustment_stock_transfer.create')
  @ApiOperation({ summary: 'Create a new stock transfer' })
  create(@Body() createDto: CreateInvStockTransferDto) {
    return this.transferService.create(createDto);
  }

  @Get()
  @Permissions('inventory_adjustment_stock_transfer.read')
  @ApiOperation({ summary: 'Get all stock transfers' })
  findAll(@Query() query: QueryInvStockTransferDto) {
    return this.transferService.findAll(query);
  }

  @Get(':id')
  @Permissions('inventory_adjustment_stock_transfer.read')
  @ApiOperation({ summary: 'Get a single stock transfer by id' })
  findOne(@Param('id') id: string) {
    return this.transferService.findOne(id);
  }

  @Patch(':id')
  @Permissions('inventory_adjustment_stock_transfer.update')
  @ApiOperation({ summary: 'Update a stock transfer' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInvStockTransferDto) {
    return this.transferService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_adjustment_stock_transfer.delete')
  @ApiOperation({ summary: 'Delete a stock transfer' })
  remove(@Param('id') id: string) {
    return this.transferService.remove(id);
  }
}
