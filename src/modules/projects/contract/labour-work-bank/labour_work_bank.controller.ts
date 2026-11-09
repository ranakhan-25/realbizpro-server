import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateLabourWorkBankDto } from './dto/create_labour_work_bank.dto';
import { QueryLabourWorkBankDto } from './dto/query_labour_work_bank.dto';
import { UpdateLabourWorkBankDto } from './dto/update_labour_work_bank.dto';
import { LabourWorkBankService } from './labour_work_bank.service';

@ApiTags('Project | Contract | Labour Work Bank')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('labour-work-bank')
export class LabourWorkBankController {
  constructor(
    private readonly labourWorkBankService: LabourWorkBankService,
  ) {}

  @Post()
  @Permissions('create_projects_labour_work_bank')
  @ApiOperation({
    summary: 'Create a new labour work bank',
  })
  create(
    @Body()
    createLabourWorkBankDto: CreateLabourWorkBankDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.labourWorkBankService.create(createLabourWorkBankDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_labour_work_bank')
  @ApiOperation({
    summary:
      'Get all labour work banks (paginated)',
  })
  findAll(
    @Query()
    query: QueryLabourWorkBankDto, @CurrentUser() currentUser: any
  ) {
    return this.labourWorkBankService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_labour_work_bank')
  @ApiOperation({
    summary: 'Get labour work bank by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.labourWorkBankService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_labour_work_bank')
  @ApiOperation({
    summary: 'Update labour work bank',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateLabourWorkBankDto: UpdateLabourWorkBankDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.labourWorkBankService.update(uuid,
      updateLabourWorkBankDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_labour_work_bank')
  @ApiOperation({
    summary:
      'Soft delete labour work bank (status → inactive)',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.labourWorkBankService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_labour_work_bank')
  @ApiOperation({
    summary:
      'Restore soft-deleted labour work bank (status → active)',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.labourWorkBankService.restore(uuid, userId, currentUser);
  }
}
