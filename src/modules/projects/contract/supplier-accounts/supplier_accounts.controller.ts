import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateSupplierAccountDto } from './dto/create_supplier_account.dto';
import { QuerySupplierAccountDto } from './dto/query_supplier_account.dto';
import { UpdateSupplierAccountDto } from './dto/update_supplier_account.dto';
import { SupplierAccountsService } from './supplier_accounts.service';

@ApiTags('Project | Contract | Supplier Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('supplier-accounts')
export class SupplierAccountsController {
  constructor(
    private readonly supplierAccountsService: SupplierAccountsService,
  ) {}

  @Post()
  @Permissions('create_projects_supplier_accounts')
  @ApiOperation({
    summary: 'Create a new supplier account',
  })
  create(
    @Body()
    createSupplierAccountDto: CreateSupplierAccountDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.supplierAccountsService.create(createSupplierAccountDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_supplier_accounts')
  @ApiOperation({
    summary:
      'Get all supplier accounts (paginated)',
  })
  findAll(
    @Query()
    query: QuerySupplierAccountDto, @CurrentUser() currentUser: any
  ) {
    return this.supplierAccountsService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_supplier_accounts')
  @ApiOperation({
    summary: 'Get supplier account by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.supplierAccountsService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_supplier_accounts')
  @ApiOperation({
    summary: 'Update supplier account',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateSupplierAccountDto: UpdateSupplierAccountDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.supplierAccountsService.update(uuid,
      updateSupplierAccountDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_supplier_accounts')
  @ApiOperation({
    summary:
      'Soft delete supplier account (status → inactive)',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.supplierAccountsService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_supplier_accounts')
  @ApiOperation({
    summary:
      'Restore soft-deleted supplier account (status → active)',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.supplierAccountsService.restore(uuid, userId, currentUser);
  }
}
