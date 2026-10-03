/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectSiteService } from './project-site.service';
import { CreateProjectSiteDto } from './dto/create-project-site.dto';
import { UpdateProjectSiteDto } from './dto/update-project-site.dto';

@Controller('project-site')
export class ProjectSiteController {
  constructor(
    private readonly projectSiteService: ProjectSiteService,
  ) {}

  @Post()
  create(
    @Body()
    createProjectSiteDto: CreateProjectSiteDto,
  ) {
    return this.projectSiteService.create(
      createProjectSiteDto,
    );
  }

  @Get()
  findAll() {
    return this.projectSiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectSiteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateProjectSiteDto: UpdateProjectSiteDto,
  ) {
    return this.projectSiteService.update(
      +id,
      updateProjectSiteDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectSiteService.remove(+id);
  }
}
