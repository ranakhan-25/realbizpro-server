/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { FundRequisitionService } from './fund-requisition.service';

import { CreateFundRequisitionDto } from './dto/create-fund-requisition.dto';
import { UpdateFundRequisitionDto } from './dto/update-fund-requisition.dto';
import { QueryFundRequisitionDto } from './dto/query-fund-requisition.dto';

@ApiTags('Project | Requisition | Fund Requisition')
@ApiBearerAuth()
@Controller('fund-requisition')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FundRequisitionController {
  constructor(
    private readonly fundRequisitionService: FundRequisitionService,
  ) {}

  @Post()
  @Permissions('create_fund_requisition')
  @ApiOperation({
    summary: 'Create a new fund requisition',
  })
  create(@Body() dto: CreateFundRequisitionDto) {
    return this.fundRequisitionService.create(
      dto,
    );
  }

  @Get('reports')
  @Permissions('view_fund_requisition_reports')
  @ApiOperation({
    summary: 'Get fund requisition report rows (paginated and filterable)',
  })
  findReport(
    @Query() query: QueryFundRequisitionDto,
  ) {
    return this.fundRequisitionService.findAll(
      query,
    );
  }

  @Get()
  @Permissions('view_fund_requisitions')
  @ApiOperation({
    summary:
      'Get all fund requisitions (paginated)',
  })
  findAll(
    @Query() query: QueryFundRequisitionDto,
  ) {
    return this.fundRequisitionService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @Permissions('view_fund_requisition')
  @ApiOperation({
    summary: 'Get a fund requisition by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.fundRequisitionService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @Permissions('update_fund_requisition')
  @ApiOperation({
    summary: 'Update a fund requisition',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateFundRequisitionDto,
  ) {
    return this.fundRequisitionService.update(
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_fund_requisition')
  @ApiOperation({
    summary: 'Delete a fund requisition',
  })
  remove(@Param('uuid') uuid: string) {
    return this.fundRequisitionService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @Permissions('restore_fund_requisition')
  @ApiOperation({
    summary: 'Restore a deleted fund requisition',
  })
  restore(@Param('uuid') uuid: string) {
    return this.fundRequisitionService.restore(
      uuid,
    );
  }
}
