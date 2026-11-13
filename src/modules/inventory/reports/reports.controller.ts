import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Reports')
@ApiBearerAuth()
@Controller('inventory/reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('stock')
  @Permissions('inventory_reports.read')
  @ApiOperation({ summary: 'Get current stock report (calculated from purchases, transfers, usages)' })
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'item_id', required: false })
  getStockReport(@Query('project_id') projectId?: number, @Query('item_id') itemId?: string) {
    return this.reportsService.getStockReport(projectId, itemId);
  }

  @Get('material-comparison')
  @Permissions('inventory_reports.read')
  @ApiOperation({ summary: 'Compare Budget Qty vs Purchase Qty vs Issue Qty' })
  @ApiQuery({ name: 'project_id', required: true })
  getMaterialComparison(@Query('project_id') projectId: number) {
    return this.reportsService.getMaterialComparison(projectId);
  }

  @Get('item-history')
  @Permissions('inventory_reports.read')
  @ApiOperation({ summary: 'Get ledger history for inventory items' })
  @ApiQuery({ name: 'item_id', required: false })
  getItemHistory(@Query('item_id') itemId?: string) {
    return this.reportsService.getItemHistory(itemId);
  }
}
