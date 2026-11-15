/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { QueryShiftDto } from './dto/query-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Shift')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @Permissions('create_shift')
  @ApiOperation({ summary: 'Create shift' })
  create(
    @Body() dto: CreateShiftDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.shiftService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_shift')
  @ApiOperation({ summary: 'Get all shifts (paginated)' })
  findAll(
    @Query() query: QueryShiftDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.shiftService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_shift')
  @ApiOperation({ summary: 'Get shift by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.shiftService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_shift')
  @ApiOperation({ summary: 'Update shift' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateShiftDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.shiftService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_shift')
  @ApiOperation({ summary: 'Delete shift' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.shiftService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_shift')
  @ApiOperation({ summary: 'Restore soft-deleted shift' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.shiftService.restore(uuid, userId, currentUser);
  }
}
