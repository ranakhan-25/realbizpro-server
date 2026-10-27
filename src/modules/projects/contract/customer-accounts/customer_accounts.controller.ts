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

import { CreateCustomerAccountDto } from './dto/create_customer_account.dto';
import { QueryCustomerAccountDto } from './dto/query_customer_account.dto';
import { UpdateCustomerAccountDto } from './dto/update_customer_account.dto';
import { CustomerAccountService } from './customer_accounts.service';

@ApiTags('Project | Contract | Customer Account')
@ApiBearerAuth()
@Controller('customer-account')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CustomerAccountController {
  constructor(
    private readonly customerAccountService: CustomerAccountService,
  ) {}

  @Post()
  @Permissions('create_customer')
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
  @Permissions('view_customers')
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
  @Permissions('view_customer')
  @ApiOperation({
    summary: 'Get customer account by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.customerAccountService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @Permissions('update_customer')
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
  @Permissions('delete_customer')
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
  @Permissions('restore_customer')
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
