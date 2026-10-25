import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadCategoryDto } from './dto/create-lead-category.dto';
import { QueryLeadCategoryDto } from './dto/query-lead-category.dto';
import { UpdateLeadCategoryDto } from './dto/update-lead-category.dto';
import { LeadCategoryService } from './lead-category.service';

@ApiTags('CRM | Configuration | Lead Category')
@ApiBearerAuth()
@Controller('crm/configuration/lead-categories')
export class LeadCategoryController {
  constructor(private readonly service: LeadCategoryService) {}

  @Post() @ApiOperation({ summary: 'Create a lead category' })
  create(@Body() dto: CreateLeadCategoryDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List lead categories with search, active filter, and pagination' })
  findAll(@Query() query: QueryLeadCategoryDto) { return this.service.findAll(query); }

  @Get(':uuid') @ApiOperation({ summary: 'Get lead category details by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a lead category by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateLeadCategoryDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a lead category by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted lead category by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
