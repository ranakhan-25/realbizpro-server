import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProcurementWorkOrderDto, QueryProcurementWorkOrderDto } from './dto/procurement-work-order.dto';
import { ProcurementWorkOrderService } from './procurement-work-order.service';

@ApiTags('Procurement | Work Orders')
@ApiBearerAuth()
@Controller('procurement/work-orders')
export class ProcurementWorkOrderController {
  constructor(private readonly service: ProcurementWorkOrderService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Project, subcontractor, approved requisition, work-order type/mode and status dropdowns' })
  dropdowns(@Query('project_id') projectId?: string) { return this.service.dropdowns(projectId); }

  @Get('trash') trash(@Query() query: QueryProcurementWorkOrderDto) { return this.service.findAll(query, true); }
  @Get() @ApiOperation({ summary: 'List/filter work orders with project, subcontractor and item relations' })
  findAll(@Query() query: QueryProcurementWorkOrderDto) { return this.service.findAll(query); }

  @Post() @ApiOperation({ summary: 'Create a labor/subcontract work order and its line items' })
  create(@Body() dto: CreateProcurementWorkOrderDto) { return this.service.create(dto); }

  @Get(':uuid') findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: CreateProcurementWorkOrderDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }
  @Patch(':uuid/restore') restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
