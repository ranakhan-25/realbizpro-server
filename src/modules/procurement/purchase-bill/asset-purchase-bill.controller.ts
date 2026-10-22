import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssetPurchaseBillService } from './asset-purchase-bill.service';
import { CreateAssetPurchaseBillDto, QueryAssetPurchaseBillDto } from './dto/asset-purchase-bill.dto';
@ApiTags('Procurement | Asset Purchase Bill/Invoice')
@ApiBearerAuth()
@Controller('procurement/asset-purchase-bill')
export class AssetPurchaseBillController {
  constructor(private readonly service: AssetPurchaseBillService) {}
  @Get() @ApiOperation({ summary: 'List/filter asset purchase bills and invoices' }) list(@Query() q: QueryAssetPurchaseBillDto) { return this.service.list(q); }
  @Get('dropdowns') dropdowns() { return this.service.dropdowns(); }
  @Get('pending-grns') pendingGrns(@Query('supplier_id') supplierId?: string, @Query('project_id') projectId?: string) { return this.service.pendingGrns(supplierId, projectId); }
  @Get(':uuid') view(@Param('uuid') uuid: string) { return this.service.view(uuid); }
  @Post() create(@Body() dto: CreateAssetPurchaseBillDto, @Req() req: any) { return this.service.create(dto, req.user?.id); }
  @Patch(':uuid') update(@Param('uuid') uuid: string, @Body() dto: CreateAssetPurchaseBillDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') remove(@Param('uuid') uuid: string) { return this.service.remove(uuid); }
}
