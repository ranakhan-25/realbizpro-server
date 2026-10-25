import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePriceRangeDto } from './dto/create-price-range.dto';
import { QueryPriceRangeDto } from './dto/query-price-range.dto';
import { UpdatePriceRangeDto } from './dto/update-price-range.dto';
import { PriceRangeService } from './price-range.service';

@ApiTags('CRM | Configuration | Price Range')
@ApiBearerAuth()
@Controller('crm/configuration/price-ranges')
export class PriceRangeController {
  constructor(private readonly service: PriceRangeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a CRM price range using From Price and To Price' })
  create(@Body() dto: CreatePriceRangeDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'List CRM price ranges with search and pagination' })
  findAll(@Query() query: QueryPriceRangeDto) { return this.service.findAll(query); }

  @Get('dropdown')
  @ApiOperation({ summary: 'Get CRM price ranges for lead forms' })
  dropdown() { return this.service.dropdown(); }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a CRM price range by UUID with related leads' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a CRM price range by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdatePriceRangeDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft-delete a CRM price range by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted CRM price range by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
