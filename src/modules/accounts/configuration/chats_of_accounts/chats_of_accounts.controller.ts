/* eslint-disable prettier/prettier */

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Put, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe 
} from '@nestjs/common';
import { ChartOfAccountService } from './chats_of_accounts.service';
import { CreateChartOfAccountDto } from './dto/create-chats_of_account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chats_of_account.dto';
import { QueryChartOfAccountDto } from './dto/query-chats_of_account.dto';

@Controller('chart-of-accounts')
export class ChartOfAccountController {
  constructor(private readonly accountService: ChartOfAccountService) {}

  @Post()
  create(@Body() dto: CreateChartOfAccountDto) {
    return this.accountService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryChartOfAccountDto) {
    return this.accountService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.accountService.findOne(uuid);
  }

  // ✅ PATCH সাপোর্ট
  @Patch(':uuid')
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChartOfAccountDto,
  ) {
    return this.accountService.update(uuid, dto);
  }

  // ✅ PUT সাপোর্ট
  @Put(':uuid')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChartOfAccountDto,
  ) {
    return this.accountService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.accountService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.accountService.restore(uuid);
  }
}