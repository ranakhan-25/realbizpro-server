/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { QueryCommissionDto } from './dto/query-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Commission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Post()
  @Permissions('create_commission')
  @ApiOperation({ summary: 'Create commission' })
  create(
    @Body() dto: CreateCommissionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.commissionService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_commission')
  @ApiOperation({ summary: 'Get all commissions (paginated)' })
  findAll(
    @Query() query: QueryCommissionDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.commissionService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_commission')
  @ApiOperation({ summary: 'Get commission by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.commissionService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_commission')
  @ApiOperation({ summary: 'Update commission' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateCommissionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.commissionService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_commission')
  @ApiOperation({ summary: 'Delete commission' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.commissionService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_commission')
  @ApiOperation({ summary: 'Restore soft-deleted commission' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.commissionService.restore(uuid, userId, currentUser);
  }
}
