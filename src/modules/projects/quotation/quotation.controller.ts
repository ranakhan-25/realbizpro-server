/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { QueryQuotationDto } from './dto/query-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';

type AuthenticatedRequest = Request & {
  user?: { id?: number | string };
};

@ApiTags('Project | Quotations')
@ApiBearerAuth()
@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  create(
    @Body() createQuotationDto: CreateQuotationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user?.id;
    return this.quotationService.create(
      createQuotationDto,
      userId === undefined ? undefined : String(userId),
    );
  }

  @Get()
  findAll(@Query() query: QueryQuotationDto) {
    return this.quotationService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.quotationService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user?.id;
    return this.quotationService.update(
      uuid,
      updateQuotationDto,
      userId === undefined ? undefined : String(userId),
    );
  }

  @Delete(':uuid')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user?.id;
    return this.quotationService.remove(
      uuid,
      userId === undefined ? undefined : String(userId),
    );
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.quotationService.restore(uuid);
  }
}