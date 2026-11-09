/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowanceService } from './allowance.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { QueryAllowanceDto } from './dto/query-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Allowance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('allowance')
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) {}

  @Post()
  @Permissions('create_allowance')
  @ApiOperation({ summary: 'Create allowance' })
  create(
    @Body() dto: CreateAllowanceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_allowance')
  @ApiOperation({ summary: 'Get all allowances (paginated)' })
  findAll(
    @Query() query: QueryAllowanceDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_allowance')
  @ApiOperation({ summary: 'Get allowance by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_allowance')
  @ApiOperation({ summary: 'Update allowance' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateAllowanceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_allowance')
  @ApiOperation({ summary: 'Delete allowance' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_allowance')
  @ApiOperation({ summary: 'Restore soft-deleted allowance' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceService.restore(uuid, userId, currentUser);
  }
}
