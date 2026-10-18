import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkOrderDto } from './work-order.dto';
import { WorkOrderService } from './work-order.service';

@ApiTags('Project Billing | Work Orders')
@ApiBearerAuth()
@Controller('project-billing/work-orders')
export class WorkOrderController {
  constructor(private readonly service: WorkOrderService) {}
  @Post() create(@Body() body: WorkOrderDto) { return this.service.create(body); }
  @Get() findAll(@Query() query: any) { return this.service.findAll(query); }
  @Get(':uuid') findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') update(@Param('uuid') uuid: string, @Body() body: WorkOrderDto) { return this.service.update(uuid, body); }
  @Delete(':uuid') remove(@Param('uuid') uuid: string) { return this.service.remove(uuid); }
}
