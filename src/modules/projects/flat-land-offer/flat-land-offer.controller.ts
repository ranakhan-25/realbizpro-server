import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Put, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandOfferDto } from './dto/create-flat-land-offer.dto';
import { QueryFlatLandOfferDto } from './dto/query-flat-land-offer.dto';
import { UpdateFlatLandOfferDto } from './dto/update-flat-land-offer.dto';
import { FlatLandOfferService } from './flat-land-offer.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('CRM | Property | Sale Offer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('flat-land-offers')
export class FlatLandOfferController {
  constructor(private readonly offerService: FlatLandOfferService) {}

  @Post()
  @Permissions('create_projects_flat_land_offer')
  @ApiOperation({ summary: 'Create a flat/land sale offer' })
  create(
    @Body() dto: CreateFlatLandOfferDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.offerService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_flat_land_offer')
  @ApiOperation({ summary: 'List flat/land sale offers' })
  findAll(
    @Query() query: QueryFlatLandOfferDto, @CurrentUser() currentUser: any
  ) {
    return this.offerService.findAll(query, currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_projects_flat_land_offer')
  @ApiOperation({ summary: 'Get project, flat/land property, and offer status dropdown data' })
  dropdowns(
    @CurrentUser() currentUser: any
  ) {
    return this.offerService.dropdowns();
  }

  @Get(':uuid')
  @Permissions('read_projects_flat_land_offer')
  @ApiOperation({ summary: 'Get a flat/land sale offer by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.offerService.findOne(uuid, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_flat_land_offer')
  @ApiOperation({ summary: 'Update a flat/land sale offer (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandOfferDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.update(uuid, dto, userId, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_flat_land_offer')
  @ApiOperation({ summary: 'Update a flat/land sale offer' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandOfferDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.offerService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_flat_land_offer')
  @ApiOperation({ summary: 'Soft-delete a flat/land sale offer' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.offerService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_flat_land_offer')
  @ApiOperation({ summary: 'Restore a deleted flat/land sale offer' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.offerService.restore(uuid, userId, currentUser);
  }
}
