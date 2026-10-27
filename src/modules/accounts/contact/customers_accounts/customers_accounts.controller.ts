/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CustomerAccountService } from './customers_accounts.service';
import { QueryCustomerAccountDto } from './dto/query-customers_account.dto';
import { CreateCustomerAccountDto } from './dto/create-customers_account.dto';
import { UpdateCustomerAccountDto } from './dto/update-customers_account.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts | contact | customers-accounts ')
@Controller('customer-accounts')
export class CustomerAccountController {
  constructor(private readonly customerService: CustomerAccountService) {}

  @Post()
  create(@Body() dto: CreateCustomerAccountDto) {
    return this.customerService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryCustomerAccountDto) {
    return this.customerService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.customerService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateCustomerAccountDto) {
    return this.customerService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateCustomerAccountDto) {
    return this.customerService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.customerService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.customerService.restore(uuid);
  }
}