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
  ParseUUIDPipe,
} from '@nestjs/common';
import { PayCommissionService } from './paymodal.service';
import { CreatePayCommissionDto } from './dto/create-paymodal.dto';
import { UpdatePayCommissionDto } from './dto/update-paymodal.dto';
import { QueryPayCommissionDto } from './dto/query-paymodal.dto';

@Controller('pay-commissions')
export class PaymodalController {
  constructor(
    private readonly payCommissionService: PayCommissionService,
  ) {}

  @Post()
  create(@Body() dto: CreatePayCommissionDto) {
    return this.payCommissionService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryPayCommissionDto) {
    return this.payCommissionService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.payCommissionService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePayCommissionDto,
  ) {
    return this.payCommissionService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePayCommissionDto,
  ) {
    return this.payCommissionService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.payCommissionService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.payCommissionService.restore(uuid);
  }
}