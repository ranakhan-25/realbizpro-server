import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ServiceWorkRequisitionService } from './service-work-requisition.service';

import { CreateServiceWorkRequisitionDto } from './dto/create-service-work-requisition.dto';
import { UpdateServiceWorkRequisitionDto } from './dto/update-service-work-requisition.dto';
import { QueryServiceWorkRequisitionDto } from './dto/query-service-work-requisition.dto';

@ApiTags('Project | Requisition | Service Work Requisition')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('service-work-requisition')
export class ServiceWorkRequisitionController {
  constructor(
    private readonly serviceWorkRequisitionService: ServiceWorkRequisitionService,
  ) {}

  @Post()
  @Permissions('create_projects_service_work_requisition')
  @ApiOperation({
    summary:
      'Create a new service work requisition',
  })
  create(
    @Body() dto: CreateServiceWorkRequisitionDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_service_work_requisition')
  @ApiOperation({
    summary:
      'Get all service work requisitions (paginated)',
  })
  findAll(
    @Query()
    query: QueryServiceWorkRequisitionDto, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_service_work_requisition')
  @ApiOperation({
    summary:
      'Get a service work requisition by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_service_work_requisition')
  @ApiOperation({
    summary: 'Update a service work requisition',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateServiceWorkRequisitionDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionService.update(uuid,
      dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_service_work_requisition')
  @ApiOperation({
    summary: 'Delete a service work requisition',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_service_work_requisition')
  @ApiOperation({
    summary:
      'Restore a deleted service work requisition',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.serviceWorkRequisitionService.restore(uuid, userId, currentUser);
  }
}
