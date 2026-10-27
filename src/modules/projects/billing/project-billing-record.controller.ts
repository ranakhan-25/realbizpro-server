/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CreateProjectBillingRecordDto } from './dto/create-project-billing-record.dto';
import { QueryProjectBillingRecordDto } from './dto/query-project-billing-record.dto';
import { UpdateProjectBillingRecordDto } from './dto/update-project-billing-record.dto';
import { ProjectBillingRecordService } from './project-billing-record.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('Project Billing')
@ApiBearerAuth()
@Controller('project-billing')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectBillingRecordController {
  constructor(private readonly billingService: ProjectBillingRecordService) {}

  @Post(':resource')
  @Permissions('create_project_billing_record')
  @ApiOperation({ summary: 'Create a project billing record' })
  create(
    @Param('resource') resource: string,
    @Body() dto: CreateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.billingService.create(resource, dto, request.user?.id);
  }

  @Get(':resource/reports')
  @Permissions('view_project_billing_reports')
  @ApiOperation({ summary: 'List project billing report records' })
  report(
    @Param('resource') resource: string,
    @Query() query: QueryProjectBillingRecordDto,
  ) {
    return this.billingService.findAll(resource, query);
  }

  @Get(':resource')
  @Permissions('view_project_billing_records')
  @ApiOperation({ summary: 'List project billing records' })
  findAll(
    @Param('resource') resource: string,
    @Query() query: QueryProjectBillingRecordDto,
  ) {
    return this.billingService.findAll(resource, query);
  }

  @Get(':resource/:uuid')
  @Permissions('view_project_billing_record')
  @ApiOperation({ summary: 'Get a project billing record by UUID' })
  findOne(
    @Param('resource') resource: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.billingService.findOne(resource, uuid);
  }

  @Patch(':resource/:uuid')
  @Permissions('update_project_billing_record')
  @ApiOperation({ summary: 'Update a project billing record' })
  update(
    @Param('resource') resource: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.billingService.update(resource, uuid, dto, request.user?.id);
  }

  @Delete(':resource/:uuid')
  @Permissions('delete_project_billing_record')
  @ApiOperation({ summary: 'Soft-delete a project billing record' })
  remove(
    @Param('resource') resource: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.billingService.remove(resource, uuid);
  }
}
