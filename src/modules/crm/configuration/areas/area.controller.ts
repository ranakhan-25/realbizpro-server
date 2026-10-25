import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAreaDto } from './dto/create-area.dto';
import { QueryAreaDto } from './dto/query-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AreaService } from './area.service';

@ApiTags('CRM | Configuration | Area')
@ApiBearerAuth()
@Controller('crm/configuration/areas')
export class AreaController {
  constructor(private readonly service: AreaService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM area' })
  create(@Body() dto: CreateAreaDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List CRM areas with search, status and pagination filters' })
  findAll(@Query() query: QueryAreaDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get active CRM areas for form dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get('dropdown/statuses') @ApiOperation({ summary: 'Get area statuses for the form dropdown' })
  statusDropdown() { return this.service.statusDropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get CRM area details by UUID, including related leads' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a CRM area by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateAreaDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a CRM area by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted CRM area by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
