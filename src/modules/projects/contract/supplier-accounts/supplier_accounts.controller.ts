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

import { CreateSupplierAccountDto } from './dto/create_supplier_account.dto';
import { QuerySupplierAccountDto } from './dto/query_supplier_account.dto';
import { UpdateSupplierAccountDto } from './dto/update_supplier_account.dto';
import { SupplierAccountsService } from './supplier_accounts.service';

@ApiTags('Project | Contract | Supplier Accounts')
@ApiBearerAuth()
@Controller('supplier-accounts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SupplierAccountsController {
  constructor(
    private readonly supplierAccountsService: SupplierAccountsService,
  ) {}

  @Post()
  @Permissions('create_supplier_account')
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
  @Permissions('view_supplier_accounts')
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
  @Permissions('view_supplier_account')
  @ApiOperation({
    summary: 'Get supplier account by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.supplierAccountsService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @Permissions('update_supplier_account')
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
  @Permissions('delete_supplier_account')
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
  @Permissions('restore_supplier_account')
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
