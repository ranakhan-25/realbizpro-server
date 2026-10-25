import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { QueryProfessionDto } from './dto/query-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { ProfessionService } from './profession.service';

@ApiTags('CRM | Configuration | Profession')
@ApiBearerAuth()
@Controller('crm/configuration/professions')
export class ProfessionController {
  constructor(private readonly service: ProfessionService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM profession' })
  create(@Body() dto: CreateProfessionDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List professions with search, status, and pagination filters' })
  findAll(@Query() query: QueryProfessionDto) { return this.service.findAll(query); }

  @Get('dropdown/statuses') @ApiOperation({ summary: 'Get profession statuses for the form dropdown' })
  statusDropdown() { return this.service.statusDropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get profession details by UUID, including related leads' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a CRM profession by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateProfessionDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a CRM profession by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted CRM profession by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
