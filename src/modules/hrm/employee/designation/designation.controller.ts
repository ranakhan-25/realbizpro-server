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

import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { QueryDesignationDto } from './dto/query-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@ApiTags('Designation')
@ApiBearerAuth()
@Controller('designation')
export class DesignationController {
  constructor(
    private readonly designationService: DesignationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new designation',
  })
  create(
    @Body()
    createDesignationDto: CreateDesignationDto,
  ) {
    return this.designationService.create(
      createDesignationDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all designations (paginated)',
  })
  findAll(
    @Query()
    query: QueryDesignationDto,
  ) {
    return this.designationService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get designation by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.designationService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update designation',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateDesignationDto: UpdateDesignationDto,
  ) {
    return this.designationService.update(
      uuid,
      updateDesignationDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete designation (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.designationService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted designation (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.designationService.restore(uuid);
  }
}
