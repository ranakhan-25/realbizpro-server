import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PurchaseBillService } from './purchase-bill.service';
import { CreatePurchaseBillDto, QueryPurchaseBillDto, UpdatePurchaseBillDto } from './dto/purchase-bill.dto';
@ApiTags('Procurement | Purchase Bill/Invoice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/purchase-bill')
export class PurchaseBillController {
  constructor(private readonly service: PurchaseBillService) {}
  @Get() @ApiOperation({ summary: 'List and filter purchase bills/invoices' }) list(@Query() q: QueryPurchaseBillDto) { return this.service.list(q); }
  @Get('dropdowns') @Permissions('view_procurement_purchase_bill')
  dropdowns() { return this.service.dropdowns(); }
  @Get('pending-grns') @Permissions('view_procurement_purchase_bill')
  pendingGrns(@Query('project_id') projectId?: string, @Query('supplier_id') supplierId?: string) { return this.service.pendingGrns(projectId, supplierId); }
  @Get(':uuid') @Permissions('view_procurement_purchase_bill')
  view(@Param('uuid') uuid: string) { return this.service.view(uuid); }
  @Post() @Permissions('create_procurement_purchase_bill')
  create(@Body() dto: CreatePurchaseBillDto, @Req() req: any) { return this.service.create(dto, req.user?.id); }
  @Patch(':uuid') @Permissions('update_procurement_purchase_bill')
  update(@Param('uuid') uuid: string, @Body() dto: UpdatePurchaseBillDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') @Permissions('delete_procurement_purchase_bill')
  remove(@Param('uuid') uuid: string) { return this.service.remove(uuid); }
}
