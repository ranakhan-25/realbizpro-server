import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkOrderDto } from './work-order.dto';
import { WorkOrderService } from './work-order.service';

@ApiTags('Project Billing | Work Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/work-orders')
export class WorkOrderController {
  constructor(
    private readonly service: WorkOrderService,
  ) {}
  @Post()
  @Permissions('create_projects_work_order')
  create(
    @Body() body: WorkOrderDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.service.create(body, userId, currentUser);
  }
  @Get()
  @Permissions('list_projects_work_order')
  findAll(
    @Query() query: any, @CurrentUser() currentUser: any
  ) {
    return this.service.findAll(query, currentUser);
  }
  @Get(':uuid')
  @Permissions('read_projects_work_order')
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.service.findOne(uuid, currentUser);
  }
  @Patch(':uuid')
  @Permissions('update_projects_work_order')
  update(
    @Param('uuid') uuid: string,
    @Body() body: WorkOrderDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.service.update(uuid, body, userId, currentUser);
  }
  @Delete(':uuid')
  @Permissions('delete_projects_work_order')
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }
}
