/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MonthYearService } from './month-year.service';
import { CreateMonthYearDto } from './dto/create-month-year.dto';
import { QueryMonthYearDto } from './dto/query-month-year.dto';
import { UpdateMonthYearDto } from './dto/update-month-year.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Month Year')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('month-year')
export class MonthYearController {
  constructor(private readonly monthYearService: MonthYearService) {}

  @Post()
  @Permissions('create_month_year')
  @ApiOperation({ summary: 'Create month year' })
  create(
    @Body() dto: CreateMonthYearDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.monthYearService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_month_year')
  @ApiOperation({ summary: 'Get all month years (paginated)' })
  findAll(
    @Query() query: QueryMonthYearDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.monthYearService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_month_year')
  @ApiOperation({ summary: 'Get month year by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.monthYearService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_month_year')
  @ApiOperation({ summary: 'Update month year' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateMonthYearDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.monthYearService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_month_year')
  @ApiOperation({ summary: 'Delete month year' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.monthYearService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_month_year')
  @ApiOperation({ summary: 'Restore soft-deleted month year' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.monthYearService.restore(uuid, userId, currentUser);
  }
}
