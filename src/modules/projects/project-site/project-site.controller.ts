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
import { ProjectSiteService } from './project-site.service';
import { CreateProjectSiteDto } from './dto/create-project-site.dto';

import { UpdateProjectSiteDto } from './dto/update-project-site.dto';
import { QueryProjectSiteDto } from './dto/query-site.dto';

@ApiTags('Project Sites')
@ApiBearerAuth()
@Controller('project-sites')
export class ProjectSiteController {
  constructor(private readonly projectSiteService: ProjectSiteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new site' })
  create(@Body() dto: CreateProjectSiteDto) {
    return this.projectSiteService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sites (paginated)' })
  findAll(@Query() query: QueryProjectSiteDto) {
    return this.projectSiteService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get site by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectSiteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update site' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectSiteDto,
  ) {
    return this.projectSiteService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete site' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectSiteService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft-deleted site' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.projectSiteService.restore(id);
  }
}