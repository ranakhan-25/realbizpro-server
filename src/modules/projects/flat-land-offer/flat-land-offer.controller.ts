/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
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
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FlatLandOfferController {
  constructor(private readonly offerService: FlatLandOfferService) {}

  @Post()
  @Permissions('create_flat_land_offer')
  @ApiOperation({ summary: 'Create a flat/land sale offer' })
  create(
    @Body() dto: CreateFlatLandOfferDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.offerService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_flat_land_offers')
  @ApiOperation({ summary: 'List flat/land sale offers' })
  findAll(@Query() query: QueryFlatLandOfferDto) {
    return this.offerService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_flat_land_offer')
  @ApiOperation({ summary: 'Get a flat/land sale offer by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.offerService.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('update_flat_land_offer')
  @ApiOperation({ summary: 'Update a flat/land sale offer (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandOfferDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.update(uuid, dto, request);
  }

  @Patch(':uuid')
  @Permissions('update_flat_land_offer')
  @ApiOperation({ summary: 'Update a flat/land sale offer' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandOfferDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.offerService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @Permissions('delete_flat_land_offer')
  @ApiOperation({ summary: 'Soft-delete a flat/land sale offer' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.offerService.remove(uuid);
  }
}
