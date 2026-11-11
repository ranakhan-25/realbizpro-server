import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FundRequisitionService } from './fund-requisition.service';

import { CreateFundRequisitionDto } from './dto/create-fund-requisition.dto';
import { UpdateFundRequisitionDto } from './dto/update-fund-requisition.dto';
import { QueryFundRequisitionDto } from './dto/query-fund-requisition.dto';

@ApiTags('Project | Requisition | Fund Requisition')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('fund-requisition')
export class FundRequisitionController {
  constructor(
    private readonly fundRequisitionService: FundRequisitionService,
  ) {}

  @Post()
  @Permissions('create_projects_fund_requisition')
  @ApiOperation({
    summary: 'Create a new fund requisition',
  })
  create(
    @Body() dto: CreateFundRequisitionDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.fundRequisitionService.create(dto, userId, currentUser);
  }

  @Get('reports')
  @Permissions('list_projects_fund_requisition')
  @ApiOperation({
    summary: 'Get fund requisition report rows (paginated and filterable)',
  })
  findReport(
    @Query() query: QueryFundRequisitionDto, @CurrentUser() currentUser: any
  ) {
    return this.fundRequisitionService.findAll(query, currentUser);
  }

  @Get()
  @Permissions('list_projects_fund_requisition')
  @ApiOperation({
    summary:
      'Get all fund requisitions (paginated)',
  })
  findAll(
    @Query() query: QueryFundRequisitionDto, @CurrentUser() currentUser: any
  ) {
    return this.fundRequisitionService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_fund_requisition')
  @ApiOperation({
    summary: 'Get a fund requisition by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.fundRequisitionService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_fund_requisition')
  @ApiOperation({
    summary: 'Update a fund requisition',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateFundRequisitionDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.fundRequisitionService.update(uuid,
      dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_fund_requisition')
  @ApiOperation({
    summary: 'Delete a fund requisition',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.fundRequisitionService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_fund_requisition')
  @ApiOperation({
    summary: 'Restore a deleted fund requisition',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.fundRequisitionService.restore(uuid, userId, currentUser);
  }
}
