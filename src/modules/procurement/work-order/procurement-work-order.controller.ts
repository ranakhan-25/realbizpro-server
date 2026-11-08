import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProcurementWorkOrderDto, QueryProcurementWorkOrderDto } from './dto/procurement-work-order.dto';
import { ProcurementWorkOrderService } from './procurement-work-order.service';

@ApiTags('Procurement | Work Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/work-orders')
export class ProcurementWorkOrderController {
  constructor(private readonly service: ProcurementWorkOrderService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Project, subcontractor, approved requisition, work-order type/mode and status dropdowns' })
  @Permissions('view_procurement_work_order')
  dropdowns(@Query('project_id') projectId?: string) { return this.service.dropdowns(projectId); }

  @Get('trash') @Permissions('view_procurement_work_order')
  trash(@Query() query: QueryProcurementWorkOrderDto) { return this.service.findAll(query, true); }
  @Get() @ApiOperation({ summary: 'List/filter work orders with project, subcontractor and item relations' })
  @Permissions('view_procurement_work_order')
  findAll(@Query() query: QueryProcurementWorkOrderDto) { return this.service.findAll(query); }

  @Post() @ApiOperation({ summary: 'Create a labor/subcontract work order and its line items' })
  @Permissions('create_procurement_work_order')
  create(@Body() dto: CreateProcurementWorkOrderDto) { return this.service.create(dto); }

  @Get(':uuid') @Permissions('view_procurement_work_order')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') @Permissions('update_procurement_work_order')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: CreateProcurementWorkOrderDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') @Permissions('delete_procurement_work_order')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }
  @Patch(':uuid/restore') @Permissions('update_procurement_work_order')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
