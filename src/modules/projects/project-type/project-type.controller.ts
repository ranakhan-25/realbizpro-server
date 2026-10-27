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
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { QueryProjectTypeDto } from './dto/query-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { ProjectTypeService } from './project-type.service';

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
  };
};

@ApiTags('Project | Types')
@ApiBearerAuth()
@Controller('project-type')
export class ProjectTypeController {
  constructor(
    private readonly projectTypeService: ProjectTypeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a project type' })
  create(
    @Body() dto: CreateProjectTypeDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectTypeService.create(dto, request.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List project types' })
  findAll(@Query() query: QueryProjectTypeDto) {
    return this.projectTypeService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project type by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectTypeService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a project type' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectTypeDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectTypeService.update(
      uuid,
      dto,
      request.user?.id,
    );
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft-delete a project type' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectTypeService.remove(uuid);
  }
}
