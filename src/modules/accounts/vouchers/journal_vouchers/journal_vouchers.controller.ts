/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JournalVoucherService } from './journal_vouchers.service';
import { CreateJournalVoucherDto } from './dto/create-journal_voucher.dto';
import { QueryJournalVoucherDto } from './dto/query-contra_voucher.dto';
import { UpdateJournalVoucherDto } from './dto/update-journal_voucher.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags("Accounts | vouchers | journal-vouchers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('journal-vouchers')
export class JournalVoucherController {
  constructor(private readonly voucherService: JournalVoucherService) {}

  @Post()
  @Permissions('create_journal_voucher')
  @ApiOperation({ summary: 'Create journal voucher' })
  create(
    @Body() dto: CreateJournalVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_journal_voucher')
  @ApiOperation({ summary: 'List journal vouchers' })
  findAll(
    @Query() query: QueryJournalVoucherDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_journal_voucher')
  @ApiOperation({ summary: 'Get journal voucher by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_journal_voucher')
  @ApiOperation({ summary: 'Update journal voucher (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateJournalVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_journal_voucher')
  @ApiOperation({ summary: 'Update journal voucher (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateJournalVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_journal_voucher')
  @ApiOperation({ summary: 'Delete journal voucher' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_journal_voucher')
  @ApiOperation({ summary: 'Restore journal voucher' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.restore(uuid, userId, currentUser);
  }
}
