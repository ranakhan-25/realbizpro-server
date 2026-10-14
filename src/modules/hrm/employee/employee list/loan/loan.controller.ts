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

import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { QueryLoanDto } from './dto/query-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@ApiTags('Loan')
@ApiBearerAuth()
@Controller('loan')
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new loan',
  })
  create(
    @Body()
    createLoanDto: CreateLoanDto,
  ) {
    return this.loanService.create(createLoanDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all loans (paginated)',
  })
  findAll(
    @Query()
    query: QueryLoanDto,
  ) {
    return this.loanService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get loan by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.loanService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update loan',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateLoanDto: UpdateLoanDto,
  ) {
    return this.loanService.update(
      uuid,
      updateLoanDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete loan',
  })
  remove(@Param('uuid') uuid: string) {
    return this.loanService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted loan',
  })
  restore(@Param('uuid') uuid: string) {
    return this.loanService.restore(uuid);
  }
}
