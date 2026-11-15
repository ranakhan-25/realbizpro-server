import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MovementService } from './movement.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/auth.decorators';

@ApiTags('Inventory - Movement & Operations')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MovementController {
  constructor(private readonly service: MovementService) {}

  @Post('opening')
  @Permissions('inventory_opening_stock.create')
  @ApiOperation({ summary: 'Record opening stock movement' })
  async recordOpening(@Body() dto: CreateMovementDto, @CurrentUser() user: any) {
    return this.service.recordMovement('opening', dto, user);
  }

  @Post('returns')
  @Permissions('inventory_adjustment.create')
  @ApiOperation({ summary: 'Record material return to warehouse' })
  async recordReturn(@Body() dto: CreateMovementDto, @CurrentUser() user: any) {
    return this.service.recordMovement('return', dto, user);
  }

  @Post('transfers')
  @Permissions('inventory_adjustment_stock_transfer.create')
  @ApiOperation({ summary: 'Record inter warehouse stock transfer' })
  async recordTransfer(@Body() dto: CreateMovementDto, @CurrentUser() user: any) {
    return this.service.recordMovement('transfer', dto, user);
  }

  @Post('adjustments')
  @Permissions('inventory_adjustment.create')
  @ApiOperation({ summary: 'Record inventory count discrepancy or adjustment' })
  async recordAdjustment(@Body() dto: CreateMovementDto, @CurrentUser() user: any) {
    return this.service.recordMovement('adjustment', dto, user);
  }

  @Post('consumption')
  @Permissions('inventory_adjustment_material_usage.create')
  @ApiOperation({ summary: 'Record direct site material consumption' })
  async recordConsumption(@Body() dto: CreateMovementDto, @CurrentUser() user: any) {
    return this.service.recordMovement('consumption', dto, user);
  }

  @Get('balance')
  @Permissions('inventory_products.read')
  @ApiOperation({ summary: 'Get current real time stock balances' })
  async getStockBalances(
    @CurrentUser() user: any,
    @Query('org_id') queryOrgId?: string,
    @Query('warehouse_id') warehouseId?: number,
    @Query('item_id') itemId?: string,
  ) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || queryOrgId;
    return this.service.getStockBalances({
      org_id: orgId,
      warehouse_id: warehouseId,
      item_id: itemId,
    });
  }

  @Get('ledger')
  @Permissions('inventory_reports.read')
  @ApiOperation({ summary: 'Get complete double entry material movement ledger' })
  async getLedger(
    @CurrentUser() user: any,
    @Query('org_id') queryOrgId?: string,
    @Query('warehouse_id') warehouseId?: number,
    @Query('item_id') itemId?: string,
    @Query('movement_type') movementType?: string,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || queryOrgId;
    return this.service.getLedger({
      org_id: orgId,
      warehouse_id: warehouseId,
      item_id: itemId,
      movement_type: movementType,
      from_date: fromDate,
      to_date: toDate,
    });
  }

  @Get('slow-moving')
  @Permissions('inventory_reports.read')
  @ApiOperation({ summary: 'Get slow moving and aging stock analysis' })
  async getSlowMoving(@CurrentUser() user: any, @Query('org_id') queryOrgId?: string) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || queryOrgId;
    return this.service.getSlowMoving(orgId);
  }
}
