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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { FundRequisitionService } from './fund-requisition.service';

import { CreateFundRequisitionDto } from './dto/create-fund-requisition.dto';
import { UpdateFundRequisitionDto } from './dto/update-fund-requisition.dto';
import { QueryFundRequisitionDto } from './dto/query-fund-requisition.dto';

@ApiTags('Fund Requisition')
@ApiBearerAuth()
@Controller('fund-requisition')
export class FundRequisitionController {
  constructor(
    private readonly fundRequisitionService: FundRequisitionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new fund requisition',
  })
  create(@Body() dto: CreateFundRequisitionDto) {
    return this.fundRequisitionService.create(
      dto,
    );
  }

  @Get()
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
  @ApiOperation({
    summary: 'Get a fund requisition by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.fundRequisitionService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
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
  @ApiOperation({
    summary: 'Delete a fund requisition',
  })
  remove(@Param('uuid') uuid: string) {
    return this.fundRequisitionService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore a deleted fund requisition',
  })
  restore(@Param('uuid') uuid: string) {
    return this.fundRequisitionService.restore(
      uuid,
    );
  }
}
