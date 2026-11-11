/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { QueryOvertimeDto } from './dto/query-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Overtime')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post()
  @Permissions('create_overtime')
  @ApiOperation({ summary: 'Create overtime' })
  create(
    @Body() dto: CreateOvertimeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.overtimeService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_overtime')
  @ApiOperation({ summary: 'Get all overtimes (paginated)' })
  findAll(
    @Query() query: QueryOvertimeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.overtimeService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_overtime')
  @ApiOperation({ summary: 'Get overtime by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.overtimeService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_overtime')
  @ApiOperation({ summary: 'Update overtime' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateOvertimeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.overtimeService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_overtime')
  @ApiOperation({ summary: 'Delete overtime' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.overtimeService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_overtime')
  @ApiOperation({ summary: 'Restore soft-deleted overtime' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.overtimeService.restore(uuid, userId, currentUser);
  }
}
