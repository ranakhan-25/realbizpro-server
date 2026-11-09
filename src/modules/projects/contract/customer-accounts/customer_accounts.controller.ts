import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateCustomerAccountDto } from './dto/create_customer_account.dto';
import { QueryCustomerAccountDto } from './dto/query_customer_account.dto';
import { UpdateCustomerAccountDto } from './dto/update_customer_account.dto';
import { CustomerAccountService } from './customer_accounts.service';

@ApiTags('Project | Contract | Customer Account')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('customer-account')
export class CustomerAccountController {
  constructor(
    private readonly customerAccountService: CustomerAccountService,
  ) {}

  @Post()
  @Permissions('create_projects_customer_account')
  @ApiOperation({
    summary: 'Create a new customer account',
  })
  create(
    @Body()
    createCustomerAccountDto: CreateCustomerAccountDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.customerAccountService.create(createCustomerAccountDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_customer_account')
  @ApiOperation({
    summary:
      'Get all customer accounts (paginated)',
  })
  findAll(
    @Query()
    query: QueryCustomerAccountDto, @CurrentUser() currentUser: any
  ) {
    return this.customerAccountService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_customer_account')
  @ApiOperation({
    summary: 'Get customer account by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.customerAccountService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_customer_account')
  @ApiOperation({
    summary: 'Update customer account',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateCustomerAccountDto: UpdateCustomerAccountDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.customerAccountService.update(uuid,
      updateCustomerAccountDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_customer_account')
  @ApiOperation({
    summary:
      'Soft delete customer account (status → inactive)',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.customerAccountService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_customer_account')
  @ApiOperation({
    summary:
      'Restore soft-deleted customer account (status → active)',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.customerAccountService.restore(uuid, userId, currentUser);
  }
}
