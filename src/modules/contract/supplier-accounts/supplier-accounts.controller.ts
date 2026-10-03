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

import { CreateSupplierAccountDto } from './dto/create-supplier-account.dto';
import { QuerySupplierAccountDto } from './dto/query-supplier-account.dto';
import { UpdateSupplierAccountDto } from './dto/update-supplier-account.dto';

import { SupplierAccountsService } from './supplier-accounts.service';

@ApiTags('Supplier Accounts')
@ApiBearerAuth()
@Controller('supplier-accounts')
export class SupplierAccountsController {
  constructor(
    private readonly supplierAccountsService: SupplierAccountsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new supplier account',
  })
  create(
    @Body()
    createSupplierAccountDto: CreateSupplierAccountDto,
  ) {
    return this.supplierAccountsService.create(
      createSupplierAccountDto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all supplier accounts (paginated)',
  })
  findAll(
    @Query()
    query: QuerySupplierAccountDto,
  ) {
    return this.supplierAccountsService.findAll(
      query,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get supplier account by ID',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.supplierAccountsService.findOne(
      id,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update supplier account',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateSupplierAccountDto: UpdateSupplierAccountDto,
  ) {
    return this.supplierAccountsService.update(
      id,
      updateSupplierAccountDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete supplier account',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.supplierAccountsService.remove(
      id,
    );
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted supplier account',
  })
  restore(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.supplierAccountsService.restore(
      id,
    );
  }
}
