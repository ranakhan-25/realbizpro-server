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
import { AllowanceDeductionSetupService } from './allowance-deduction-setup.service';
import { CreateAllowanceDeductionSetupDto } from './dto/create-allowance-deduction-setup.dto';
import { QueryAllowanceDeductionSetupDto } from './dto/query-allowance-deduction-setup.dto';
import { UpdateAllowanceDeductionSetupDto } from './dto/update-allowance-deduction-setup.dto';

@ApiTags(
  'HRM | Configuration | Allowance Deduction Setup',
)
@ApiBearerAuth()
@Controller('allowance-deduction-setup')
export class AllowanceDeductionSetupController {
  constructor(
    private readonly allowanceDeductionSetupService: AllowanceDeductionSetupService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new allowance/deduction setup',
  })
  create(
    @Body()
    createDto: CreateAllowanceDeductionSetupDto,
  ) {
    return this.allowanceDeductionSetupService.create(
      createDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all allowance/deduction setups',
  })
  findAll(
    @Query()
    query: QueryAllowanceDeductionSetupDto,
  ) {
    return this.allowanceDeductionSetupService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary:
      'Get allowance/deduction setup by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.allowanceDeductionSetupService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update allowance/deduction setup',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateDto: UpdateAllowanceDeductionSetupDto,
  ) {
    return this.allowanceDeductionSetupService.update(
      uuid,
      updateDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete allowance/deduction setup',
  })
  remove(@Param('uuid') uuid: string) {
    return this.allowanceDeductionSetupService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted allowance/deduction setup',
  })
  restore(@Param('uuid') uuid: string) {
    return this.allowanceDeductionSetupService.restore(
      uuid,
    );
  }
}
