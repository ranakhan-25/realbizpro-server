import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { QueryTaskTypeDto } from './dto/query-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';
import { TaskTypeService } from './task-type.service';

type AuthenticatedRequest = Request & { user?: { id?: number; username?: string; firstName?: string | null; lastName?: string | null } };

@ApiTags('CRM | Configuration | Task Type')
@ApiBearerAuth()
@Controller('crm/configuration/task-types')
export class TaskTypeController {
  constructor(private readonly service: TaskTypeService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM task type' })
  create(@Body() dto: CreateTaskTypeDto, @Req() req: AuthenticatedRequest) { return this.service.create(dto, this.actor(req)); }

  @Get() @ApiOperation({ summary: 'List CRM task types with search and pagination' })
  findAll(@Query() query: QueryTaskTypeDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get active task types for CRM task dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get a task type by UUID with related CRM tasks' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a CRM task type by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateTaskTypeDto, @Req() req: AuthenticatedRequest) {
    return this.service.update(uuid, dto, this.actor(req));
  }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete a CRM task type by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: AuthenticatedRequest) { return this.service.remove(uuid, this.actor(req)); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore an inactive or soft-deleted CRM task type' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }

  private actor(req: AuthenticatedRequest) {
    const user = req.user;
    return user?.username || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || (user?.id != null ? String(user.id) : undefined);
  }
}
