import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectBillingRecordDto } from './dto/create-project-billing-record.dto';
import { QueryProjectBillingRecordDto } from './dto/query-project-billing-record.dto';
import { UpdateProjectBillingRecordDto } from './dto/update-project-billing-record.dto';
import { ProjectBillingRecordService } from './project-billing-record.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('Project Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing')
export class ProjectBillingRecordController {
  constructor(private readonly billingService: ProjectBillingRecordService) {}

  @Post(':resource')
  @Permissions('create_projects_project_billing_record')
  @ApiOperation({ summary: 'Create a project billing record' })
  create(
    @Param('resource') resource: string,
    @Body() dto: CreateProjectBillingRecordDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billingService.create(resource, dto, userId, currentUser);
  }

  @Get(':resource/reports')
  @ApiOperation({ summary: 'List project billing report records' })
  report(
    @Param('resource') resource: string,
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.billingService.findAll(resource, query, currentUser);
  }

  @Get(':resource')
  @ApiOperation({ summary: 'List project billing records' })
  findAll(
    @Param('resource') resource: string,
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.billingService.findAll(resource, query, currentUser);
  }

  @Get(':resource/:uuid')
  @ApiOperation({ summary: 'Get a project billing record by UUID' })
  findOne(
    @Param('resource') resource: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.billingService.findOne(resource, uuid, currentUser);
  }

  @Patch(':resource/:uuid')
  @ApiOperation({ summary: 'Update a project billing record' })
  update(
    @Param('resource') resource: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.billingService.update(resource, uuid, dto, userId, currentUser);
  }

  @Delete(':resource/:uuid')
  @ApiOperation({ summary: 'Soft-delete a project billing record' })
  remove(
    @Param('resource') resource: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.billingService.remove(resource, uuid, userId, currentUser);
  }
}
