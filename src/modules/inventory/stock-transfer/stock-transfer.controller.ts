import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StockTransferService } from './stock-transfer.service';
import { CreateInvStockTransferDto } from './dto/create-inv-stock-transfer.dto';
import { UpdateInvStockTransferDto } from './dto/update-inv-stock-transfer.dto';
import { QueryInvStockTransferDto } from './dto/query-inv-stock-transfer.dto';

@ApiTags('Inventory - Stock Transfer')
@Controller('inventory/stock-transfers')
export class StockTransferController {
  constructor(private readonly transferService: StockTransferService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock transfer' })
  create(@Body() createDto: CreateInvStockTransferDto) {
    return this.transferService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock transfers' })
  findAll(@Query() query: QueryInvStockTransferDto) {
    return this.transferService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single stock transfer by id' })
  findOne(@Param('id') id: string) {
    return this.transferService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a stock transfer' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInvStockTransferDto) {
    return this.transferService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a stock transfer' })
  remove(@Param('id') id: string) {
    return this.transferService.remove(id);
  }
}
