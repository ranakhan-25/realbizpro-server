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
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ProjectCostService } from './project_cost.service';
import { CreateProjectCostDto } from './dto/create-project_cost.dto';
import { QueryProjectCostDto } from './dto/query-project_cost.dto';
import { UpdateProjectCostDto } from './dto/update-project_cost.dto';

@Controller('project-costs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectCostController {
  constructor(private readonly costService: ProjectCostService) {}

  @Post()
  @Permissions('create_project_cost')
  create(@Body() createDto: CreateProjectCostDto) {
    return this.costService.create(createDto);
  }

  @Get()
  @Permissions('view_project_costs')
  findAll(@Query() query: QueryProjectCostDto) {
    return this.costService.findAll(query);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  @Permissions('view_project_cost_summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.costService.getSummary(projectUuid);
  }

  @Get(':uuid')
  @Permissions('view_project_cost')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.costService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_cost')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectCostDto
  ) {
    return this.costService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('delete_project_cost')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.costService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project_cost')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.costService.restore(uuid);
  }
}