/* eslint-disable prettier/prettier */

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe 
} from '@nestjs/common';
import { ProjectCostService } from './project_cost.service';
import { CreateProjectCostDto } from './dto/create-project_cost.dto';
import { QueryProjectCostDto } from './dto/query-project_cost.dto';
import { UpdateProjectCostDto } from './dto/update-project_cost.dto';

@Controller('project-costs')
export class ProjectCostController {
  constructor(private readonly costService: ProjectCostService) {}

  @Post()
  create(@Body() createDto: CreateProjectCostDto) {
    return this.costService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryProjectCostDto) {
    return this.costService.findAll(query);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.costService.getSummary(projectUuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.costService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectCostDto
  ) {
    return this.costService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.costService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.costService.restore(uuid);
  }
}