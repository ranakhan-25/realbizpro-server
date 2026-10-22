import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { QueryPurchaseOrderDto } from './dto/query-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrderService } from './purchase-order.service';

@ApiTags('Procurement | Purchase Order')
@ApiBearerAuth()
@Controller('procurement/purchase-order')
export class PurchaseOrderController {
  constructor(private readonly service: PurchaseOrderService) {}
  @Post() @ApiOperation({ summary: 'Create purchase order with item lines' }) create(@Body() dto: CreatePurchaseOrderDto, @Req() req: any) { return this.service.create(dto, req.user?.id ?? req.user?.uuid); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get populated dropdown options for purchase order form' }) dropdowns(@Query('project_id') projectId?: string, @Query('category_id') categoryId?: string) { return this.service.dropdowns(projectId, categoryId); }
  @Get() @ApiOperation({ summary: 'List and filter purchase orders' }) findAll(@Query() query: QueryPurchaseOrderDto) { return this.service.findAll(query); }
  @Get(':uuid') findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') update(@Param('uuid') uuid: string, @Body() dto: UpdatePurchaseOrderDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.id ?? req.user?.uuid); }
  @Delete(':uuid') remove(@Param('uuid') uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.id ?? req.user?.uuid); }
  @Patch(':uuid/restore') restore(@Param('uuid') uuid: string) { return this.service.restore(uuid); }
}
