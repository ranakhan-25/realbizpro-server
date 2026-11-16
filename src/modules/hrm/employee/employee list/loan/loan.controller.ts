/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { QueryLoanDto } from './dto/query-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Loan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @Permissions('create_loan')
  @ApiOperation({ summary: 'Create loan' })
  create(
    @Body() dto: CreateLoanDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.loanService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_loan')
  @ApiOperation({ summary: 'Get all loans (paginated)' })
  findAll(
    @Query() query: QueryLoanDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.loanService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_loan')
  @ApiOperation({ summary: 'Get loan by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.loanService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_loan')
  @ApiOperation({ summary: 'Update loan' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateLoanDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.loanService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_loan')
  @ApiOperation({ summary: 'Delete loan' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.loanService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_loan')
  @ApiOperation({ summary: 'Restore soft-deleted loan' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.loanService.restore(uuid, userId, currentUser);
  }
}
