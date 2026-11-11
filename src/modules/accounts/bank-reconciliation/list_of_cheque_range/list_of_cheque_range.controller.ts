/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ChequeRangeService } from './list_of_cheque_range.service';
import { CreateChequeRangeDto } from './dto/create-list_of_cheque_range.dto';
import { UpdateChequeRangeDto } from './dto/update-list_of_cheque_range.dto';
import { QueryChequeRangeDto } from './dto/query-list_of_cheque_range.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags("Accounts | bank-reconciliations | list-of-cheque-range")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cheque-ranges')
export class ChequeRangeController {
  constructor(private readonly chequeRangeService: ChequeRangeService) {}

  @Post()
  @Permissions('create_cheque_range')
  @ApiOperation({ summary: 'Create cheque range' })
  create(
    @Body() dto: CreateChequeRangeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeRangeService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_cheque_range')
  @ApiOperation({ summary: 'List cheque ranges' })
  findAll(
    @Query() query: QueryChequeRangeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeRangeService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_cheque_range')
  @ApiOperation({ summary: 'Get cheque range by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeRangeService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_cheque_range')
  @ApiOperation({ summary: 'Update cheque range (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChequeRangeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeRangeService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_cheque_range')
  @ApiOperation({ summary: 'Update cheque range (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChequeRangeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeRangeService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_cheque_range')
  @ApiOperation({ summary: 'Delete cheque range' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeRangeService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_cheque_range')
  @ApiOperation({ summary: 'Restore cheque range' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeRangeService.restore(uuid, userId, currentUser);
  }
}
