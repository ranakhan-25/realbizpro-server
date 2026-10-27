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
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectTypeController {
  constructor(
    private readonly projectTypeService: ProjectTypeService,
  ) {}

  @Post()
  @Permissions('create_project_type')
  @ApiOperation({ summary: 'Create a project type' })
  create(
    @Body() dto: CreateProjectTypeDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectTypeService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_project_types')
  @ApiOperation({ summary: 'List project types' })
  findAll(@Query() query: QueryProjectTypeDto) {
    return this.projectTypeService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project_type')
  @ApiOperation({ summary: 'Get a project type by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectTypeService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_type')
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
  @Permissions('delete_project_type')
  @ApiOperation({ summary: 'Soft-delete a project type' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectTypeService.remove(uuid);
  }
}
