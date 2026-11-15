/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BankReconciliationService } from './bank-reconciliation_statement.service';
import { CreateBankReconciliationDto } from './dto/create-bank-reconciliation_statement.dto';
import { UpdateBankReconciliationDto } from './dto/update-bank-reconciliation_statement.dto';
import { QueryBankReconciliationDto } from './dto/query-bank-reconciliation_statement.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags("Accounts | bank-reconciliations | bank-reconciliations-statement")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bank-reconciliations')
export class BankReconciliationController {
  constructor(private readonly reconciliationService: BankReconciliationService) {}

  @Post()
  @Permissions('create_bank_reconciliation')
  @ApiOperation({ summary: 'Create bank reconciliation' })
  create(
    @Body() dto: CreateBankReconciliationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.reconciliationService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_bank_reconciliation')
  @ApiOperation({ summary: 'List bank reconciliations' })
  findAll(
    @Query() query: QueryBankReconciliationDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.reconciliationService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_bank_reconciliation')
  @ApiOperation({ summary: 'Get bank reconciliation by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.reconciliationService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_bank_reconciliation')
  @ApiOperation({ summary: 'Update bank reconciliation (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateBankReconciliationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.reconciliationService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_bank_reconciliation')
  @ApiOperation({ summary: 'Update bank reconciliation (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateBankReconciliationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.reconciliationService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_bank_reconciliation')
  @ApiOperation({ summary: 'Delete bank reconciliation' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.reconciliationService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_bank_reconciliation')
  @ApiOperation({ summary: 'Restore bank reconciliation' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.reconciliationService.restore(uuid, userId, currentUser);
  }
}
