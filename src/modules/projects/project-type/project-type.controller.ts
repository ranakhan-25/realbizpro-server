import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectTypeService } from './project-type.service'; // ← type নয়, সাধারণ import
import { CreateProjectDto } from './dto/create-project-type.dto';
import { QueryProjectDto } from './dto/query-project-type.dto';
import { UpdateProjectDto } from './dto/update-project-type.dto';

@ApiTags('Project Types')
@ApiBearerAuth()
@Controller('project-types')
export class ProjectTypeController {
  constructor(
    private readonly projectTypeService: ProjectTypeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new project type',
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectTypeService.create(
      createProjectDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all project types (paginated)',
  })
  findAll(@Query() query: QueryProjectDto) {
    return this.projectTypeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project type by ID',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectTypeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project type',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectTypeService.update(
      id,
      updateProjectDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete project type',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectTypeService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted project type',
  })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.projectTypeService.restore(id);
  }
}
