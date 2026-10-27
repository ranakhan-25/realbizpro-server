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
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectShareAssignmentDto } from './dto/create-project-share-assignment.dto';
import { QueryProjectShareAssignmentDto } from './dto/query-project-share-assignment.dto';
import { UpdateProjectShareAssignmentDto } from './dto/update-project-share-assignment.dto';
import { ProjectShareAssignmentService } from './project-share-assignment.service';

type AuthenticatedRequest = Request & {
  user?: { id?: number };
};

@ApiTags('CRM | Property | Share/Package')
@ApiBearerAuth()
@Controller('project-share-assignments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectShareAssignmentController {
  constructor(
    private readonly assignmentService: ProjectShareAssignmentService,
  ) {}

  @Get('reports/collection')
  @Permissions('view_project_share_assignment_reports')
  @ApiOperation({
    summary: 'List share collection report rows',
  })
  collectionReport() {
    return this.assignmentService.findReport(
      'collection',
    );
  }

  @Get('reports/penalty')
  @Permissions('view_project_share_assignment_reports')
  @ApiOperation({
    summary: 'List share penalty report rows',
  })
  penaltyReport() {
    return this.assignmentService.findReport(
      'penalty',
    );
  }

  @Get('reports/holders-point')
  @Permissions('view_project_share_assignment_reports')
  @ApiOperation({
    summary:
      'List shareholder points report rows',
  })
  holdersPointReport() {
    return this.assignmentService.findReport(
      'holders-point',
    );
  }

  @Post()
  @Permissions('create_project_share_assignment')
  @ApiOperation({
    summary: 'Create a share assignment',
  })
  create(
    @Body() dto: CreateProjectShareAssignmentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.assignmentService.create(
      dto,
      request.user?.id,
    );
  }

  @Get()
  @Permissions('view_project_share_assignments')
  @ApiOperation({
    summary: 'List share assignments',
  })
  findAll(
    @Query()
    query: QueryProjectShareAssignmentDto,
  ) {
    return this.assignmentService.findAll(query);
  }

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get project, project type, and site dropdown data for share/package records' })
  dropdowns() { return this.assignmentService.dropdowns(); }

  @Get(':uuid')
  @Permissions('view_project_share_assignment')
  @ApiOperation({
    summary: 'Get a share assignment by UUID',
  })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.assignmentService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_share_assignment')
  @ApiOperation({
    summary: 'Update a share assignment',
  })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectShareAssignmentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.assignmentService.update(
      uuid,
      dto,
      request.user?.id,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_project_share_assignment')
  @ApiOperation({
    summary: 'Soft-delete a share assignment',
  })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.assignmentService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted share/package assignment' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.assignmentService.restore(uuid); }
}
