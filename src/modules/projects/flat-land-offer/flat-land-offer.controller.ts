/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandOfferDto } from './dto/create-flat-land-offer.dto';
import { QueryFlatLandOfferDto } from './dto/query-flat-land-offer.dto';
import { UpdateFlatLandOfferDto } from './dto/update-flat-land-offer.dto';
import { FlatLandOfferService } from './flat-land-offer.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('Project | Flat/Land Sale Offers')
@ApiBearerAuth()
@Controller('flat-land-offers')
export class FlatLandOfferController {
  constructor(private readonly offerService: FlatLandOfferService) {}

  @Post()
  @ApiOperation({ summary: 'Create a flat/land sale offer' })
  create(
    @Body() dto: CreateFlatLandOfferDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.offerService.create(dto, request.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List flat/land sale offers' })
  findAll(@Query() query: QueryFlatLandOfferDto) {
    return this.offerService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a flat/land sale offer by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.offerService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a flat/land sale offer' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandOfferDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.offerService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft-delete a flat/land sale offer' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.offerService.remove(uuid);
  }
}
