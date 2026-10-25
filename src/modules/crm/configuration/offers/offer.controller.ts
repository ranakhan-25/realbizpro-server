import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOfferDto } from './dto/create-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferService } from './offer.service';

@ApiTags('CRM | Configuration | Offers')
@ApiBearerAuth()
@Controller('crm/configuration/offers')
export class OfferController {
  constructor(private readonly service: OfferService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM offer' })
  create(@Body() dto: CreateOfferDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List offers with search, status, and pagination filters' })
  findAll(@Query() query: QueryOfferDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get active offers for CRM form dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get('dropdown/statuses') @ApiOperation({ summary: 'Get offer statuses for the offer form dropdown' })
  statusDropdown() { return this.service.statusDropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get offer details by UUID, including related leads' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a CRM offer by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateOfferDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a CRM offer by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted offer by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
