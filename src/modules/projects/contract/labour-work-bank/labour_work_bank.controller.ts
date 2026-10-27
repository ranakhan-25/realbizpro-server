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

import { CreateLabourWorkBankDto } from './dto/create_labour_work_bank.dto';
import { QueryLabourWorkBankDto } from './dto/query_labour_work_bank.dto';
import { UpdateLabourWorkBankDto } from './dto/update_labour_work_bank.dto';
import { LabourWorkBankService } from './labour_work_bank.service';

@ApiTags('Project | Contract | Labour Work Bank')
@ApiBearerAuth()
@Controller('labour-work-bank')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LabourWorkBankController {
  constructor(
    private readonly labourWorkBankService: LabourWorkBankService,
  ) {}

  @Post()
  @Permissions('create_labour_work_bank')
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
  @Permissions('view_labour_work_banks')
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
  @Permissions('view_labour_work_bank')
  @ApiOperation({
    summary: 'Get labour work bank by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.labourWorkBankService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @Permissions('update_labour_work_bank')
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
  @Permissions('delete_labour_work_bank')
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
  @Permissions('restore_labour_work_bank')
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
