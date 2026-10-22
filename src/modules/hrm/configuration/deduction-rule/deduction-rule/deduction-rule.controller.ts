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

import { DeductionRuleService } from './deduction-rule.service';
import { CreateDeductionRuleDto } from './dto/create-deduction-rule.dto';
import { QueryDeductionRuleDto } from './dto/query-deduction-rule.dto';
import { UpdateDeductionRuleDto } from './dto/update-deduction-rule.dto';

@ApiTags('HRM | Configuration | Deduction Rule')
@ApiBearerAuth()
@Controller('deduction-rule')
export class DeductionRuleController {
  constructor(
    private readonly deductionRuleService: DeductionRuleService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new deduction rule',
  })
  create(
    @Body()
    createDeductionRuleDto: CreateDeductionRuleDto,
  ) {
    return this.deductionRuleService.create(
      createDeductionRuleDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all deduction rules (paginated)',
  })
  findAll(
    @Query()
    query: QueryDeductionRuleDto,
  ) {
    return this.deductionRuleService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get deduction rule by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.deductionRuleService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update deduction rule',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateDeductionRuleDto: UpdateDeductionRuleDto,
  ) {
    return this.deductionRuleService.update(
      uuid,
      updateDeductionRuleDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete deduction rule',
  })
  remove(@Param('uuid') uuid: string) {
    return this.deductionRuleService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted deduction rule',
  })
  restore(@Param('uuid') uuid: string) {
    return this.deductionRuleService.restore(uuid);
  }
}
