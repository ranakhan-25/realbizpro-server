import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ServiceWorkRequisitionItemService } from './service-work-requisition-item.service';

import { CreateServiceWorkRequisitionItemDto } from './dto/create-service-work-requisition-item.dto';
import { UpdateServiceWorkRequisitionItemDto } from './dto/update-service-work-requisition-item.dto';
import { QueryServiceWorkRequisitionItemDto } from './dto/query-service-work-requisition-item.dto';

@ApiTags('Project | Requisition | Service Work Requisition Item')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('service-work-requisition-item')
export class ServiceWorkRequisitionItemController {
  constructor(
    private readonly serviceWorkRequisitionItemService: ServiceWorkRequisitionItemService,
  ) {}

  @Post()
  @Permissions('create_projects_service_work_requisition_item')
  @ApiOperation({
    summary:
      'Create a new service work requisition item',
  })
  create(
    @Body()
    dto: CreateServiceWorkRequisitionItemDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionItemService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_service_work_requisition_item')
  @ApiOperation({
    summary:
      'Get all service work requisition items (paginated)',
  })
  findAll(
    @Query()
    query: QueryServiceWorkRequisitionItemDto, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionItemService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_service_work_requisition_item')
  @ApiOperation({
    summary:
      'Get a service work requisition item by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionItemService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_service_work_requisition_item')
  @ApiOperation({
    summary:
      'Update a service work requisition item',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    dto: UpdateServiceWorkRequisitionItemDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionItemService.update(uuid,
      dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_service_work_requisition_item')
  @ApiOperation({
    summary:
      'Delete a service work requisition item',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionItemService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_service_work_requisition_item')
  @ApiOperation({
    summary:
      'Restore a deleted service work requisition item',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionItemService.restore(uuid, userId, currentUser);
  }
}
