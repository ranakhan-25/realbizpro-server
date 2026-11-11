/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BalanceSheetService } from './balance_summury.service';
import { CreateBalanceSheetDto } from './dto/create-balance_summury.dto';
import { UpdateBalanceSheetDto } from './dto/update-balance_summury.dto';
import { QueryBalanceSheetDto } from './dto/query-balance_summury.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags("Accounts | reports | balance_sheet_summury")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('balance-sheets')
export class BalanceSheetController {
  constructor(private readonly balanceSheetService: BalanceSheetService) {}

  @Post()
  @Permissions('create_balance_sheet')
  @ApiOperation({ summary: 'Create balance sheet entry' })
  create(
    @Body() dto: CreateBalanceSheetDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.balanceSheetService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_balance_sheet')
  @ApiOperation({ summary: 'List balance sheet entries' })
  findAll(
    @Query() query: QueryBalanceSheetDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.balanceSheetService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_balance_sheet')
  @ApiOperation({ summary: 'Get balance sheet entry by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.balanceSheetService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_balance_sheet')
  @ApiOperation({ summary: 'Update balance sheet entry (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateBalanceSheetDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.balanceSheetService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_balance_sheet')
  @ApiOperation({ summary: 'Update balance sheet entry (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateBalanceSheetDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.balanceSheetService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_balance_sheet')
  @ApiOperation({ summary: 'Delete balance sheet entry' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.balanceSheetService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_balance_sheet')
  @ApiOperation({ summary: 'Restore balance sheet entry' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.balanceSheetService.restore(uuid, userId, currentUser);
  }
}
