import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProjectBudgetService } from './project_budget.service';
import { CreateProjectBudgetDto } from './dto/create-project_budget.dto';
import { QueryProjectBudgetDto } from './dto/query-project_budget.dto';
import { UpdateProjectBudgetDto } from './dto/update-project_budget.dto';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-budgets')
export class ProjectBudgetController {
  constructor(private readonly budgetService: ProjectBudgetService) {}

  @Post()
  @Permissions('create_projects_project_budget')
  create(
    @Body() createDto: CreateProjectBudgetDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.budgetService.create(createDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_budget')
  findAll(
    @Query() query: QueryProjectBudgetDto, @CurrentUser() currentUser: any
  ) {
    return this.budgetService.findAll(query, currentUser);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  @Permissions('read_projects_project_budget')
  getSummary(
    @Query('projectUuid', ParseUUIDPipe) projectUuid: string, @CurrentUser() currentUser: any
  ) {
    return this.budgetService.getSummary(projectUuid, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_budget')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.budgetService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_budget')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectBudgetDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.budgetService.update(uuid, updateDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_budget')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.budgetService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project_budget')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.budgetService.restore(uuid, userId, currentUser);
  }
}