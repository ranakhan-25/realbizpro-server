import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Project')
@ApiBearerAuth()
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new project',
  })
  create(
    @Body()
    createProjectDto: CreateProjectDto,
  ) {
    return this.projectService.create(
      createProjectDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all projects (paginated)',
  })
  findAll(
    @Query()
    query: QueryProjectDto,
  ) {
    return this.projectService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get project by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.projectService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update project',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(
      uuid,
      updateProjectDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete project (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.projectService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted project (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.projectService.restore(uuid);
  }
}