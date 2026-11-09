import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Req, UseGuards } from '@nestjs/common';
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
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  @Permissions('create_projects_quotation')
  create(
    @Body() createQuotationDto: CreateQuotationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.quotationService.create(createQuotationDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_quotation')
  findAll(
    @Query() query: QueryQuotationDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.quotationService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_quotation')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.quotationService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_quotation')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.quotationService.update(uuid, updateQuotationDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_quotation')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.quotationService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_quotation')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.quotationService.restore(uuid, userId, currentUser);
  }
}