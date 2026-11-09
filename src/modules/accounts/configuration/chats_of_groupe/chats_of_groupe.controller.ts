/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ChartOfGroupService } from './chats_of_groupe.service';
import { CreateChartOfGroupDto } from './dto/create-chats_of_groupe.dto';
import { UpdateChartOfGroupDto } from './dto/update-chats_of_groupe.dto';
import { QueryChartOfGroupDto } from './dto/query-chats_of_groupe.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('Accounts | configuration | chart-of-groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('chart-of-groups')
export class ChartOfGroupController {
  constructor(private readonly groupService: ChartOfGroupService) {}

  @Post()
  @Permissions('create_chart_of_group')
  @ApiOperation({ summary: 'Create chart of group' })
  create(
    @Body() dto: CreateChartOfGroupDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.groupService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_chart_of_group')
  @ApiOperation({ summary: 'List chart of groups' })
  findAll(
    @Query() query: QueryChartOfGroupDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.groupService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_chart_of_group')
  @ApiOperation({ summary: 'Get chart of group by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.groupService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_chart_of_group')
  @ApiOperation({ summary: 'Update chart of group (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChartOfGroupDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.groupService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_chart_of_group')
  @ApiOperation({ summary: 'Update chart of group (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChartOfGroupDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.groupService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_chart_of_group')
  @ApiOperation({ summary: 'Delete chart of group' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.groupService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_chart_of_group')
  @ApiOperation({ summary: 'Restore chart of group' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.groupService.restore(uuid, userId, currentUser);
  }
}
