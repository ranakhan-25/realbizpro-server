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

import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { QueryUnitDto } from './dto/query-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@ApiTags('Unit')
@ApiBearerAuth()
@Controller('unit')
export class UnitController {
  constructor(
    private readonly unitService: UnitService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new unit',
  })
  create(
    @Body()
    createUnitDto: CreateUnitDto,
  ) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all units (paginated)',
  })
  findAll(
    @Query()
    query: QueryUnitDto,
  ) {
    return this.unitService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get unit by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.unitService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update unit',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitService.update(
      uuid,
      updateUnitDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete unit (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.unitService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted unit (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.unitService.restore(uuid);
  }
}
