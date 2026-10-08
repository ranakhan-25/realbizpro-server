import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Inventory - Reports')
@Controller('inventory/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('stock')
  @ApiOperation({ summary: 'Get current stock report (calculated from purchases, transfers, usages)' })
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'item_id', required: false })
  getStockReport(@Query('project_id') projectId?: number, @Query('item_id') itemId?: string) {
    return this.reportsService.getStockReport(projectId, itemId);
  }

  @Get('material-comparison')
  @ApiOperation({ summary: 'Compare Budget Qty vs Purchase Qty vs Issue Qty' })
  @ApiQuery({ name: 'project_id', required: true })
  getMaterialComparison(@Query('project_id') projectId: number) {
    return this.reportsService.getMaterialComparison(projectId);
  }
}
