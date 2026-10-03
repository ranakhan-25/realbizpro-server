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

  @Get(':id')
  @ApiOperation({
    summary: 'Get customer account by ID',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.customerAccountService.findOne(
      id,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update customer account',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateCustomerAccountDto: UpdateCustomerAccountDto,
  ) {
    return this.customerAccountService.update(
      id,
      updateCustomerAccountDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete customer account',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.customerAccountService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted customer account',
  })
  restore(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.customerAccountService.restore(
      id,
    );
  }
}
