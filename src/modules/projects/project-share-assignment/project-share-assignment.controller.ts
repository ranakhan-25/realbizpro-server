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
} from '@nestjs/common';
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
export class ProjectShareAssignmentController {
  constructor(
    private readonly assignmentService: ProjectShareAssignmentService,
  ) {}

  @Get('reports/collection')
  @ApiOperation({
    summary: 'List share collection report rows',
  })
  collectionReport() {
    return this.assignmentService.findReport(
      'collection',
    );
  }

  @Get('reports/penalty')
  @ApiOperation({
    summary: 'List share penalty report rows',
  })
  penaltyReport() {
    return this.assignmentService.findReport(
      'penalty',
    );
  }

  @Get('reports/holders-point')
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
  @ApiOperation({
    summary: 'Get a share assignment by UUID',
  })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.assignmentService.findOne(uuid);
  }

  @Patch(':uuid')
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
