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

import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { QueryCommissionDto } from './dto/query-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@ApiTags('Commission')
@ApiBearerAuth()
@Controller('commission')
export class CommissionController {
  constructor(
    private readonly commissionService: CommissionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new commission',
  })
  create(
    @Body()
    createCommissionDto: CreateCommissionDto,
  ) {
    return this.commissionService.create(
      createCommissionDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all commissions (paginated)',
  })
  findAll(
    @Query()
    query: QueryCommissionDto,
  ) {
    return this.commissionService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get commission by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.commissionService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update commission',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateCommissionDto: UpdateCommissionDto,
  ) {
    return this.commissionService.update(
      uuid,
      updateCommissionDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete commission',
  })
  remove(@Param('uuid') uuid: string) {
    return this.commissionService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted commission',
  })
  restore(@Param('uuid') uuid: string) {
    return this.commissionService.restore(uuid);
  }
}
