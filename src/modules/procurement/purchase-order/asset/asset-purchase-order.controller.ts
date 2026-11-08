import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAssetPurchaseOrderDto } from './dto/create-asset-purchase-order.dto';
import { QueryAssetPurchaseOrderDto } from './dto/query-asset-purchase-order.dto';
import { UpdateAssetPurchaseOrderDto } from './dto/update-asset-purchase-order.dto';
import { AssetPurchaseOrderService } from './asset-purchase-order.service';

@ApiTags('Procurement | Asset Purchase Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/asset-purchase-order')
export class AssetPurchaseOrderController {
  constructor(private readonly service: AssetPurchaseOrderService) {}
  @Post() @ApiOperation({ summary: 'Create asset purchase order with asset item lines' }) create(@Body() dto: CreateAssetPurchaseOrderDto, @Req() req: any) { return this.service.create(dto, req.user?.id ?? req.user?.uuid); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get populated dropdown options for asset purchase order' }) dropdowns(@Query('project_id') projectId?: string, @Query('category_id') categoryId?: string) { return this.service.dropdowns(projectId, categoryId); }
  @Get() @ApiOperation({ summary: 'List/filter asset purchase orders' }) findAll(@Query() query: QueryAssetPurchaseOrderDto) { return this.service.findAll(query); }
  @Get(':uuid') @Permissions('view_procurement_asset_purchase_order')
  findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') @Permissions('update_procurement_asset_purchase_order')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateAssetPurchaseOrderDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.id ?? req.user?.uuid); }
  @Delete(':uuid') @Permissions('delete_procurement_asset_purchase_order')
  remove(@Param('uuid') uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.id ?? req.user?.uuid); }
  @Patch(':uuid/restore') @Permissions('update_procurement_asset_purchase_order')
  restore(@Param('uuid') uuid: string) { return this.service.restore(uuid); }
}
