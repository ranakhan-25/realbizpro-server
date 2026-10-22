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

import { MonthYearService } from './month-year.service';
import { CreateMonthYearDto } from './dto/create-month-year.dto';
import { QueryMonthYearDto } from './dto/query-month-year.dto';
import { UpdateMonthYearDto } from './dto/update-month-year.dto';

@ApiTags('HRM | Employee | Month Year')
@ApiBearerAuth()
@Controller('month-year')
export class MonthYearController {
  constructor(
    private readonly monthYearService: MonthYearService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new month year',
  })
  create(
    @Body()
    createMonthYearDto: CreateMonthYearDto,
  ) {
    return this.monthYearService.create(
      createMonthYearDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all month years (paginated)',
  })
  findAll(
    @Query()
    query: QueryMonthYearDto,
  ) {
    return this.monthYearService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get month year by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.monthYearService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update month year',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateMonthYearDto: UpdateMonthYearDto,
  ) {
    return this.monthYearService.update(
      uuid,
      updateMonthYearDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete month year',
  })
  remove(@Param('uuid') uuid: string) {
    return this.monthYearService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted month year',
  })
  restore(@Param('uuid') uuid: string) {
    return this.monthYearService.restore(uuid);
  }
}
