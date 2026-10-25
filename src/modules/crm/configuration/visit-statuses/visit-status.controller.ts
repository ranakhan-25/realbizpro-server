import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateVisitStatusDto } from './dto/create-visit-status.dto';
import { QueryVisitStatusDto } from './dto/query-visit-status.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';
import { VisitStatusService } from './visit-status.service';

type AuthRequest = Request & { user?: { id?: number; username?: string; firstName?: string | null; lastName?: string | null } };

@ApiTags('CRM | Configuration | Visit Status')
@ApiBearerAuth()
@Controller('crm/configuration/visit-statuses')
export class VisitStatusController {
  constructor(private readonly service: VisitStatusService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM visit status' })
  create(@Body() dto: CreateVisitStatusDto, @Req() req: AuthRequest) { return this.service.create(dto, this.actor(req)); }

  @Get() @ApiOperation({ summary: 'List visit statuses with search and pagination' })
  findAll(@Query() query: QueryVisitStatusDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get visit statuses for CRM activity dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get visit status by UUID with related activities' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update visit status by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateVisitStatusDto, @Req() req: AuthRequest) {
    return this.service.update(uuid, dto, this.actor(req));
  }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete visit status by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: AuthRequest) { return this.service.remove(uuid, this.actor(req)); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore soft-deleted visit status by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }

  private actor(req: AuthRequest) {
    const user = req.user;
    return user?.username || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || (user?.id != null ? String(user.id) : undefined);
  }
}
