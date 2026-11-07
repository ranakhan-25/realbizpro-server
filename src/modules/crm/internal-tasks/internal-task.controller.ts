import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInternalTaskDto } from './dto/create-internal-task.dto';
import { QueryInternalTaskDto } from './dto/query-internal-task.dto';
import { UpdateInternalTaskDto } from './dto/update-internal-task.dto';
import { InternalTaskService } from './internal-task.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | configuration | 1. Internal Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/tasks')
export class InternalTaskController {
  constructor(private readonly service: InternalTaskService) {}

  @Post()
  @Permissions('create_crm_internal_task')
  @ApiOperation({ summary: 'Create a CRM internal task' })
  create(
    @Body() dto: CreateInternalTaskDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_internal_task')
  @ApiOperation({ summary: 'List CRM internal tasks with filters and pagination' })
  findAll(
    @Query() query: QueryInternalTaskDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_crm_internal_task')
  @ApiOperation({ summary: 'Get project, assignee, task type, status, and priority dropdown data' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_internal_task')
  @ApiOperation({ summary: 'Get one CRM internal task with project, lead, type, and assignee relations' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_internal_task')
  @ApiOperation({ summary: 'Update a CRM internal task by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateInternalTaskDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_internal_task')
  @ApiOperation({ summary: 'Soft-delete a CRM internal task by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_internal_task')
  @ApiOperation({ summary: 'Restore a soft-deleted CRM internal task by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
