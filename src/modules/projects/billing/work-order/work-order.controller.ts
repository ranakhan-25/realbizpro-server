import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { WorkOrderDto } from './work-order.dto';
import { WorkOrderService } from './work-order.service';

@ApiTags('Project Billing | Work Orders')
@ApiBearerAuth()
@Controller('project-billing/work-orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WorkOrderController {
  constructor(
    private readonly service: WorkOrderService,
  ) {}
  @Post()
  @Permissions('create_work_order')
  create(@Body() body: WorkOrderDto) {
    return this.service.create(body);
  }
  @Get()
  @Permissions('view_work_orders')
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }
  @Get(':uuid')
  @Permissions('view_work_order')
  findOne(
    @Param('uuid') uuid: string,
  ) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid')
  @Permissions('update_work_order')
  update(
    @Param('uuid') uuid: string,
    @Body() body: WorkOrderDto,
  ) {
    return this.service.update(uuid, body);
  }
  @Delete(':uuid')
  @Permissions('delete_work_order')
  remove(
    @Param('uuid') uuid: string,
  ) {
    return this.service.remove(uuid);
  }
}
