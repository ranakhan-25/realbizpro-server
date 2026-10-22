import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PurchaseBillService } from './purchase-bill.service';
import { CreatePurchaseBillDto, QueryPurchaseBillDto, UpdatePurchaseBillDto } from './dto/purchase-bill.dto';
@ApiTags('Procurement | Purchase Bill/Invoice')
@ApiBearerAuth()
@Controller('procurement/purchase-bill')
export class PurchaseBillController {
  constructor(private readonly service: PurchaseBillService) {}
  @Get() @ApiOperation({ summary: 'List and filter purchase bills/invoices' }) list(@Query() q: QueryPurchaseBillDto) { return this.service.list(q); }
  @Get('dropdowns') dropdowns() { return this.service.dropdowns(); }
  @Get('pending-grns') pendingGrns(@Query('project_id') projectId?: string, @Query('supplier_id') supplierId?: string) { return this.service.pendingGrns(projectId, supplierId); }
  @Get(':uuid') view(@Param('uuid') uuid: string) { return this.service.view(uuid); }
  @Post() create(@Body() dto: CreatePurchaseBillDto, @Req() req: any) { return this.service.create(dto, req.user?.id); }
  @Patch(':uuid') update(@Param('uuid') uuid: string, @Body() dto: UpdatePurchaseBillDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') remove(@Param('uuid') uuid: string) { return this.service.remove(uuid); }
}
