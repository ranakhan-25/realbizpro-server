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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SupplierAccountsService } from './supplier_accounts.service';
import { CreateSupplierAccountDto } from './dto/create-supplier_account.dto';
import { QuerySupplierAccountDto } from './dto/query-supplier_account.dto';
import { UpdateSupplierAccountDto } from './dto/update-supplier_account.dto';


@ApiTags('Supplier Accounts')
@ApiBearerAuth()
@Controller('supplier-accounts')
export class SupplierAccountsController {
  constructor(private readonly service: SupplierAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier account' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 409, description: 'Code already exists' })
  create(@Body() dto: CreateSupplierAccountDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List supplier accounts (pagination/search/filter)' })
  findAll(@Query() query: QuerySupplierAccountDto) {
    return this.service.findAll(query);
  }

  @Get('by-customer/:customerAccountId')
  @ApiOperation({ summary: 'Get all suppliers under a customer account' })
  byCustomer(
    @Param('customerAccountId', ParseIntPipe) customerAccountId: number,
  ) {
    return this.service.findByCustomer(customerAccountId);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get supplier by code' })
  findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update supplier account' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierAccountDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete supplier account' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}