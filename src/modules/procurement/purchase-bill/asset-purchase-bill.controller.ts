import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssetPurchaseBillService } from './asset-purchase-bill.service';
import { CreateAssetPurchaseBillDto, QueryAssetPurchaseBillDto } from './dto/asset-purchase-bill.dto';
@ApiTags('Procurement | Asset Purchase Bill/Invoice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/asset-purchase-bill')
export class AssetPurchaseBillController {
  constructor(private readonly service: AssetPurchaseBillService) {}
  @Get() @ApiOperation({ summary: 'List/filter asset purchase bills and invoices' }) list(@Query() q: QueryAssetPurchaseBillDto) { return this.service.list(q); }
  @Get('dropdowns') @Permissions('view_procurement_asset_purchase_bill')
  dropdowns() { return this.service.dropdowns(); }
  @Get('pending-grns') @Permissions('view_procurement_asset_purchase_bill')
  pendingGrns(@Query('supplier_id') supplierId?: string, @Query('project_id') projectId?: string) { return this.service.pendingGrns(supplierId, projectId); }
  @Get(':uuid') @Permissions('view_procurement_asset_purchase_bill')
  view(@Param('uuid') uuid: string) { return this.service.view(uuid); }
  @Post() @Permissions('create_procurement_asset_purchase_bill')
  create(@Body() dto: CreateAssetPurchaseBillDto, @Req() req: any) { return this.service.create(dto, req.user?.id); }
  @Patch(':uuid') @Permissions('update_procurement_asset_purchase_bill')
  update(@Param('uuid') uuid: string, @Body() dto: CreateAssetPurchaseBillDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') @Permissions('delete_procurement_asset_purchase_bill')
  remove(@Param('uuid') uuid: string) { return this.service.remove(uuid); }
}
