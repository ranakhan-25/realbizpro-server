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

import { CreateCustomerAccountDto } from './dto/create-customer-account.dto';
import { QueryCustomerAccountDto } from './dto/query-customer-account.dto';
import { UpdateCustomerAccountDto } from './dto/update-customer-account.dto';
import { CustomerAccountService } from './customer-accounts.service';

@ApiTags('Customer Account')
@ApiBearerAuth()
@Controller('customer-account')
export class CustomerAccountController {
  constructor(
    private readonly customerAccountService: CustomerAccountService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new customer account',
  })
  create(
    @Body()
    createCustomerAccountDto: CreateCustomerAccountDto,
  ) {
    return this.customerAccountService.create(
      createCustomerAccountDto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all customer accounts (paginated)',
  })
  findAll(
    @Query()
    query: QueryCustomerAccountDto,
  ) {
    return this.customerAccountService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get customer account by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.customerAccountService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update customer account',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateCustomerAccountDto: UpdateCustomerAccountDto,
  ) {
    return this.customerAccountService.update(
      uuid,
      updateCustomerAccountDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete customer account (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.customerAccountService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted customer account (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.customerAccountService.restore(
      uuid,
    );
  }
}
