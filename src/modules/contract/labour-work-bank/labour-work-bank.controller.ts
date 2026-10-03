/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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

  @Get(':id')
  @ApiOperation({
    summary: 'Get labour work bank by ID',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.labourWorkBankService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update labour work bank',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateLabourWorkBankDto: UpdateLabourWorkBankDto,
  ) {
    return this.labourWorkBankService.update(
      id,
      updateLabourWorkBankDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete labour work bank',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.labourWorkBankService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted labour work bank',
  })
  restore(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.labourWorkBankService.restore(id);
  }
}
