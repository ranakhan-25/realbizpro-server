import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateVisitPlaceDto } from './dto/create-visit-place.dto';
import { QueryVisitPlaceDto } from './dto/query-visit-place.dto';
import { UpdateVisitPlaceDto } from './dto/update-visit-place.dto';
import { VisitPlaceService } from './visit-place.service';

type AuthenticatedRequest = Request & { user?: { id?: number; username?: string; firstName?: string | null; lastName?: string | null } };

@ApiTags('CRM | Configuration | Visit Places')
@ApiBearerAuth()
@Controller('crm/configuration/visit-places')
export class VisitPlaceController {
  constructor(private readonly service: VisitPlaceService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM visit place' })
  create(@Body() dto: CreateVisitPlaceDto, @Req() req: AuthenticatedRequest) {
    return this.service.create(dto, this.actor(req));
  }

  @Get() @ApiOperation({ summary: 'List visit places with search and pagination' })
  findAll(@Query() query: QueryVisitPlaceDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get visit places for CRM activity dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get a visit place by UUID with related activities' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a visit place by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateVisitPlaceDto, @Req() req: AuthenticatedRequest) {
    return this.service.update(uuid, dto, this.actor(req));
  }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete a visit place by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: AuthenticatedRequest) {
    return this.service.remove(uuid, this.actor(req));
  }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted visit place by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }

  private actor(req: AuthenticatedRequest) {
    const user = req.user;
    return user?.username || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || (user?.id != null ? String(user.id) : undefined);
  }
}
