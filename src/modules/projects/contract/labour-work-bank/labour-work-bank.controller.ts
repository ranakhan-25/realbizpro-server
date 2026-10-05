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

import { CreateLabourWorkBankDto } from './dto/create-labour-work-bank.dto';
import { QueryLabourWorkBankDto } from './dto/query-labour-work-bank.dto';
import { UpdateLabourWorkBankDto } from './dto/update-labour-work-bank.dto';
import { LabourWorkBankService } from './labour-work-bank.service';

@ApiTags('Labour Work Bank')
@ApiBearerAuth()
@Controller('labour-work-bank')
export class LabourWorkBankController {
  constructor(
    private readonly labourWorkBankService: LabourWorkBankService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new labour work bank',
  })
  create(
    @Body()
    createLabourWorkBankDto: CreateLabourWorkBankDto,
  ) {
    return this.labourWorkBankService.create(
      createLabourWorkBankDto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all labour work banks (paginated)',
  })
  findAll(
    @Query()
    query: QueryLabourWorkBankDto,
  ) {
    return this.labourWorkBankService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get labour work bank by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.labourWorkBankService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update labour work bank',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateLabourWorkBankDto: UpdateLabourWorkBankDto,
  ) {
    return this.labourWorkBankService.update(
      uuid,
      updateLabourWorkBankDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete labour work bank (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.labourWorkBankService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted labour work bank (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.labourWorkBankService.restore(
      uuid,
    );
  }
}
