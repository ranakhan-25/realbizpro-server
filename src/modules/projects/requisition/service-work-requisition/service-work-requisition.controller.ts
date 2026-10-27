/* eslint-disable prettier/prettier */

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
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ServiceWorkRequisitionService } from './service-work-requisition.service';

import { CreateServiceWorkRequisitionDto } from './dto/create-service-work-requisition.dto';
import { UpdateServiceWorkRequisitionDto } from './dto/update-service-work-requisition.dto';
import { QueryServiceWorkRequisitionDto } from './dto/query-service-work-requisition.dto';

@ApiTags('Project | Requisition | Service Work Requisition')
@ApiBearerAuth()
@Controller('service-work-requisition')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ServiceWorkRequisitionController {
  constructor(
    private readonly serviceWorkRequisitionService: ServiceWorkRequisitionService,
  ) {}

  @Post()
  @Permissions('create_service_work_requisition')
  @ApiOperation({
    summary:
      'Create a new service work requisition',
  })
  create(
    @Body() dto: CreateServiceWorkRequisitionDto,
  ) {
    return this.serviceWorkRequisitionService.create(
      dto,
    );
  }

  @Get()
  @Permissions('view_service_work_requisitions')
  @ApiOperation({
    summary:
      'Get all service work requisitions (paginated)',
  })
  findAll(
    @Query()
    query: QueryServiceWorkRequisitionDto,
  ) {
    return this.serviceWorkRequisitionService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @Permissions('view_service_work_requisition')
  @ApiOperation({
    summary:
      'Get a service work requisition by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.serviceWorkRequisitionService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @Permissions('update_service_work_requisition')
  @ApiOperation({
    summary: 'Update a service work requisition',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateServiceWorkRequisitionDto,
  ) {
    return this.serviceWorkRequisitionService.update(
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_service_work_requisition')
  @ApiOperation({
    summary: 'Delete a service work requisition',
  })
  remove(@Param('uuid') uuid: string) {
    return this.serviceWorkRequisitionService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @Permissions('restore_service_work_requisition')
  @ApiOperation({
    summary:
      'Restore a deleted service work requisition',
  })
  restore(@Param('uuid') uuid: string) {
    return this.serviceWorkRequisitionService.restore(
      uuid,
    );
  }
}
