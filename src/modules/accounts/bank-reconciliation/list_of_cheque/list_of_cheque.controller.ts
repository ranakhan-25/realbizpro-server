/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ChequeService } from './list_of_cheque.service';
import { CreateChequeDto } from './dto/create-list_of_cheque.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags("Account | bank_reconciliation | list of cheque ")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cheques')
export class ChequeController {
  constructor(private readonly chequeService: ChequeService) {}

  @Post()
  @Permissions('create_cheque')
  @ApiOperation({ summary: 'Create cheque' })
  create(
    @Body() dto: CreateChequeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_cheque')
  @ApiOperation({ summary: 'List cheques' })
  findAll(
    @Query() query: any,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_cheque')
  @ApiOperation({ summary: 'Get cheque by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_cheque')
  @ApiOperation({ summary: 'Update cheque (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: any,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_cheque')
  @ApiOperation({ summary: 'Update cheque (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: any,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_cheque')
  @ApiOperation({ summary: 'Delete cheque' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_cheque')
  @ApiOperation({ summary: 'Restore cheque' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.chequeService.restore(uuid, userId, currentUser);
  }
}
