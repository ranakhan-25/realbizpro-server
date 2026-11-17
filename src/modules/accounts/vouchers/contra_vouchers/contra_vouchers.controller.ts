/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CreateContraVoucherDto } from './dto/create-contra_voucher.dto';
import { QueryContraVoucherDto } from './dto/query-contra_voucher.dto';
import { ContraVoucherService } from './contra_vouchers.service';
import { UpdateContraVoucherDto } from './dto/update-contra_voucher.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags("Accounts | vouchers |contra-vouchers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('contra-vouchers')
export class ContraVoucherController {
  constructor(private readonly voucherService: ContraVoucherService) {}

  @Post()
  @Permissions('create_contra_voucher')
  @ApiOperation({ summary: 'Create contra voucher' })
  create(
    @Body() dto: CreateContraVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_contra_voucher')
  @ApiOperation({ summary: 'List contra vouchers' })
  findAll(
    @Query() query: QueryContraVoucherDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_contra_voucher')
  @ApiOperation({ summary: 'Get contra voucher by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_contra_voucher')
  @ApiOperation({ summary: 'Update contra voucher (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateContraVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_contra_voucher')
  @ApiOperation({ summary: 'Update contra voucher (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateContraVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_contra_voucher')
  @ApiOperation({ summary: 'Delete contra voucher' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_contra_voucher')
  @ApiOperation({ summary: 'Restore contra voucher' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.voucherService.restore(uuid, userId, currentUser);
  }
}
