import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateRequirementTypeDto } from './dto/create-requirement-type.dto';
import { QueryRequirementTypeDto } from './dto/query-requirement-type.dto';
import { UpdateRequirementTypeDto } from './dto/update-requirement-type.dto';
import { RequirementTypeService } from './requirement-type.service';

type AuthenticatedRequest = Request & { user?: { id?: number; username?: string; firstName?: string | null; lastName?: string | null } };

@ApiTags('CRM | Configuration | Requirement Type')
@ApiBearerAuth()
@Controller('crm/configuration/requirement-types')
export class RequirementTypeController {
  constructor(private readonly service: RequirementTypeService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM requirement type' })
  create(@Body() dto: CreateRequirementTypeDto, @Req() req: AuthenticatedRequest) {
    const user = req.user;
    const createdBy = user?.username || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || (user?.id != null ? String(user.id) : undefined);
    return this.service.create(dto, createdBy);
  }

  @Get() @ApiOperation({ summary: 'List requirement types with search and pagination' })
  findAll(@Query() query: QueryRequirementTypeDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get requirement types for CRM form dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get requirement type by UUID, including related lead requirements' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a requirement type by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateRequirementTypeDto, @Req() req: AuthenticatedRequest) {
    return this.service.update(uuid, dto, req.user?.username ?? (req.user?.id != null ? String(req.user.id) : undefined));
  }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete a requirement type by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: AuthenticatedRequest) {
    return this.service.remove(uuid, req.user?.username ?? (req.user?.id != null ? String(req.user.id) : undefined));
  }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted requirement type by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
