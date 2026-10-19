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

import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { QueryHolidayDto } from './dto/query-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@ApiTags('HRM | Configuration | Holiday')
@ApiBearerAuth()
@Controller('holiday')
export class HolidayController {
  constructor(
    private readonly holidayService: HolidayService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new holiday',
  })
  create(
    @Body()
    createHolidayDto: CreateHolidayDto,
  ) {
    return this.holidayService.create(
      createHolidayDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all holidays (paginated)',
  })
  findAll(
    @Query()
    query: QueryHolidayDto,
  ) {
    return this.holidayService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get holiday by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.holidayService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update holiday',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateHolidayDto: UpdateHolidayDto,
  ) {
    return this.holidayService.update(
      uuid,
      updateHolidayDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete holiday (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.holidayService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted holiday (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.holidayService.restore(uuid);
  }
}
