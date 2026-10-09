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

import { ServiceWorkRequisitionItemService } from './service-work-requisition-item.service';

import { CreateServiceWorkRequisitionItemDto } from './dto/create-service-work-requisition-item.dto';
import { UpdateServiceWorkRequisitionItemDto } from './dto/update-service-work-requisition-item.dto';
import { QueryServiceWorkRequisitionItemDto } from './dto/query-service-work-requisition-item.dto';

@ApiTags('Service Work Requisition Item')
@ApiBearerAuth()
@Controller('service-work-requisition-item')
export class ServiceWorkRequisitionItemController {
  constructor(
    private readonly serviceWorkRequisitionItemService: ServiceWorkRequisitionItemService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new service work requisition item',
  })
  create(
    @Body()
    dto: CreateServiceWorkRequisitionItemDto,
  ) {
    return this.serviceWorkRequisitionItemService.create(
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all service work requisition items (paginated)',
  })
  findAll(
    @Query()
    query: QueryServiceWorkRequisitionItemDto,
  ) {
    return this.serviceWorkRequisitionItemService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary:
      'Get a service work requisition item by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.serviceWorkRequisitionItemService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary:
      'Update a service work requisition item',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    dto: UpdateServiceWorkRequisitionItemDto,
  ) {
    return this.serviceWorkRequisitionItemService.update(
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Delete a service work requisition item',
  })
  remove(@Param('uuid') uuid: string) {
    return this.serviceWorkRequisitionItemService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore a deleted service work requisition item',
  })
  restore(@Param('uuid') uuid: string) {
    return this.serviceWorkRequisitionItemService.restore(
      uuid,
    );
  }
}
