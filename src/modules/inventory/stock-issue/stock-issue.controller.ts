import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { StockIssueService } from './stock-issue.service';
import { CreateStockIssueDto } from './dto/create-stock-issue.dto';
import { UpdateStockIssueDto } from './dto/update-stock-issue.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Stock Issues & Dispatches')
@ApiBearerAuth()
@Controller('inventory/stock-issues')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StockIssueController {
  constructor(private readonly service: StockIssueService) {}

  @Post()
  @Permissions('inventory_stock_issues.create')
  @ApiOperation({ summary: 'Record a new stock issue' })
  async create(@Body() createDto: CreateStockIssueDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('inventory_stock_issues.read')
  @ApiOperation({ summary: 'Get all stock issues' })
  async findAll(
    @Query('warehouse_id') warehouseId?: number,
    @Query('item_id') itemId?: string,
    @Query('org_id') orgId?: string,
  ) {
    return this.service.findAll({ warehouse_id: warehouseId, item_id: itemId, org_id: orgId });
  }

  @Get(':id')
  @Permissions('inventory_stock_issues.read')
  @ApiOperation({ summary: 'Get a stock issue by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the stock issue' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Permissions('inventory_stock_issues.update')
  @ApiOperation({ summary: 'Update a stock issue by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the stock issue' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateStockIssueDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_stock_issues.delete')
  @ApiOperation({ summary: 'Delete a stock issue by ID or UUID' })
  @ApiParam({ name: 'id', description: 'ID or UUID of the stock issue' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
