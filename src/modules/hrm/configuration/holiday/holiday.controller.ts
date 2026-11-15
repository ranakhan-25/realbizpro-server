/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { QueryHolidayDto } from './dto/query-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Configuration | Holiday')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Post()
  @Permissions('create_holiday')
  @ApiOperation({ summary: 'Create holiday' })
  create(
    @Body() dto: CreateHolidayDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.holidayService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_holiday')
  @ApiOperation({ summary: 'Get all holidays (paginated)' })
  findAll(
    @Query() query: QueryHolidayDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.holidayService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_holiday')
  @ApiOperation({ summary: 'Get holiday by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.holidayService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_holiday')
  @ApiOperation({ summary: 'Update holiday' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateHolidayDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.holidayService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_holiday')
  @ApiOperation({ summary: 'Delete holiday' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.holidayService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_holiday')
  @ApiOperation({ summary: 'Restore soft-deleted holiday' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.holidayService.restore(uuid, userId, currentUser);
  }
}
