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

import { CreateSupplierAccountDto } from './dto/create_supplier_account.dto';
import { QuerySupplierAccountDto } from './dto/query_supplier_account.dto';
import { UpdateSupplierAccountDto } from './dto/update_supplier_account.dto';
import { SupplierAccountsService } from './supplier_accounts.service';

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

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get supplier account by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.supplierAccountsService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update supplier account',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateSupplierAccountDto: UpdateSupplierAccountDto,
  ) {
    return this.supplierAccountsService.update(
      uuid,
      updateSupplierAccountDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete supplier account (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.supplierAccountsService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted supplier account (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.supplierAccountsService.restore(
      uuid,
    );
  }
}
