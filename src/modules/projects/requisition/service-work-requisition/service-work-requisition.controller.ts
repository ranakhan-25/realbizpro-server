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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ServiceWorkRequisitionService } from './service-work-requisition.service';

import { CreateServiceWorkRequisitionDto } from './dto/create-service-work-requisition.dto';
import { UpdateServiceWorkRequisitionDto } from './dto/update-service-work-requisition.dto';
import { QueryServiceWorkRequisitionDto } from './dto/query-service-work-requisition.dto';

@ApiTags('Service Work Requisition')
@ApiBearerAuth()
@Controller('service-work-requisition')
export class ServiceWorkRequisitionController {
  constructor(
    private readonly serviceWorkRequisitionService: ServiceWorkRequisitionService,
  ) {}

  @Post()
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
  @ApiOperation({
    summary: 'Delete a service work requisition',
  })
  remove(@Param('uuid') uuid: string) {
    return this.serviceWorkRequisitionService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
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
