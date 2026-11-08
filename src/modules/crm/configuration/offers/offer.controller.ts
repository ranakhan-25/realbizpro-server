import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOfferDto } from './dto/create-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferService } from './offer.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/offers')
export class OfferController {
  constructor(private readonly service: OfferService) {}

  @Post()
  @Permissions('create_crm_offer')
  @ApiOperation({ summary: 'Create a CRM offer' })
  create(
    @Body() dto: CreateOfferDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_offer')
  @ApiOperation({ summary: 'List offers with search, status, and pagination filters' })
  findAll(
    @Query() query: QueryOfferDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_offer')
  @ApiOperation({ summary: 'Get active offers for CRM form dropdowns' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get('dropdown/statuses')
  @Permissions('read_crm_offer')
  @ApiOperation({ summary: 'Get offer statuses for the offer form dropdown' })
  statusDropdown() {
    return this.service.statusDropdown();
  }

  @Get(':uuid')
  @Permissions('read_crm_offer')
  @ApiOperation({ summary: 'Get offer details by UUID, including related leads' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_offer')
  @ApiOperation({ summary: 'Update a CRM offer by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateOfferDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_offer')
  @ApiOperation({ summary: 'Soft delete a CRM offer by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_offer')
  @ApiOperation({ summary: 'Restore a soft-deleted offer by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
