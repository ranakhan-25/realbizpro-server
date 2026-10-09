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

import { MaterialRequisitionService } from './material-requisition.service';

import { CreateMaterialRequisitionDto } from './dto/create-material-requisition.dto';
import { QueryMaterialRequisitionDto } from './dto/query-material-requisition.dto';
import { UpdateMaterialRequisitionDto } from './dto/update-material-requisition.dto';

@ApiTags('Project | Material Requisition')
@ApiBearerAuth()
@Controller('material-requisition')
export class MaterialRequisitionController {
  constructor(
    private readonly materialRequisitionService: MaterialRequisitionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new material requisition',
  })
  create(
    @Body()
    createMaterialRequisitionDto: CreateMaterialRequisitionDto,
  ) {
    return this.materialRequisitionService.create(
      createMaterialRequisitionDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all material requisitions',
  })
  findAll(
    @Query()
    query: QueryMaterialRequisitionDto,
  ) {
    return this.materialRequisitionService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get material requisition by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.materialRequisitionService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary:
      'Update material requisition by UUID',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateMaterialRequisitionDto: UpdateMaterialRequisitionDto,
  ) {
    return this.materialRequisitionService.update(
      uuid,
      updateMaterialRequisitionDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete material requisition by UUID',
  })
  remove(@Param('uuid') uuid: string) {
    return this.materialRequisitionService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore deleted material requisition by UUID',
  })
  restore(@Param('uuid') uuid: string) {
    return this.materialRequisitionService.restore(
      uuid,
    );
  }
}
