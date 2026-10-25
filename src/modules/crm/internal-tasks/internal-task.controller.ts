import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateInternalTaskDto } from './dto/create-internal-task.dto';
import { QueryInternalTaskDto } from './dto/query-internal-task.dto';
import { UpdateInternalTaskDto } from './dto/update-internal-task.dto';
import { InternalTaskService } from './internal-task.service';

type AuthenticatedRequest = Request & { user?: { id?: number; uuid?: string; username?: string; firstName?: string | null; lastName?: string | null } };

@ApiTags('CRM | configuration | 1. Internal Tasks')
@ApiBearerAuth()
@Controller('crm/tasks')
export class InternalTaskController {
  constructor(private readonly service: InternalTaskService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM internal task' })
  create(@Body() dto: CreateInternalTaskDto, @Req() req: AuthenticatedRequest) { return this.service.create(dto, this.actor(req)); }

  @Get() @ApiOperation({ summary: 'List CRM internal tasks with filters and pagination' })
  findAll(@Query() query: QueryInternalTaskDto) { return this.service.findAll(query); }

  @Get('dropdowns') @ApiOperation({ summary: 'Get project, assignee, task type, status, and priority dropdown data' })
  dropdowns() { return this.service.dropdowns(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get one CRM internal task with project, lead, type, and assignee relations' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a CRM internal task by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateInternalTaskDto, @Req() req: AuthenticatedRequest) {
    return this.service.update(uuid, dto, this.actor(req));
  }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete a CRM internal task by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: AuthenticatedRequest) { return this.service.remove(uuid, this.actor(req)); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted CRM internal task by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }

  private actor(req: AuthenticatedRequest) {
    const user = req.user;
    return user?.username || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.uuid || (user?.id != null ? String(user.id) : undefined);
  }
}
