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

import { AccountMappingService } from './account-mapping.service';
import { CreateAccountMappingDto } from './dto/create-account-mapping.dto';
import { QueryAccountMappingDto } from './dto/query-account-mapping.dto';
import { UpdateAccountMappingDto } from './dto/update-account-mapping.dto';

@ApiTags(
  'Procurement | configuration | Account Mapping',
)
@ApiBearerAuth()
@Controller('account-mapping')
export class AccountMappingController {
  constructor(
    private readonly accountMappingService: AccountMappingService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create account mapping for a category',
  })
  create(
    @Body() createDto: CreateAccountMappingDto,
  ) {
    return this.accountMappingService.create(
      createDto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all account mappings (paginated)',
  })
  findAll(
    @Query() query: QueryAccountMappingDto,
  ) {
    return this.accountMappingService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get account mapping by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.accountMappingService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update account mapping',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateAccountMappingDto,
  ) {
    return this.accountMappingService.update(
      uuid,
      updateDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete account mapping',
  })
  remove(@Param('uuid') uuid: string) {
    return this.accountMappingService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted account mapping',
  })
  restore(@Param('uuid') uuid: string) {
    return this.accountMappingService.restore(
      uuid,
    );
  }
}
