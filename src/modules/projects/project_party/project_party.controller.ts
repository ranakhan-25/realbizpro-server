/* eslint-disable prettier/prettier */

import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ProjectPartyService } from './project_party.service';
import { CreateProjectPartyDto } from './dto/create-project_party.dto';
import { QueryProjectPartyDto } from './dto/query-project_party.dto';
import { UpdateProjectPartyDto } from './dto/update-project_party.dto';


@Controller('project-parties')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectPartyController {
  constructor(private readonly partyService: ProjectPartyService) {}

  @Post()
  @Permissions('create_project_party')
  create(@Body() dto: CreateProjectPartyDto) {
    return this.partyService.create(dto);
  }

  @Get()
  @Permissions('view_project_parties')
  findAll(@Query() query: QueryProjectPartyDto) {
    return this.partyService.findAll(query);
  }

  @Get('summary')
  @Permissions('view_project_party_summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.partyService.getSummary(projectUuid);
  }

  @Get(':uuid')
  @Permissions('view_project_party')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.partyService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_party')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateProjectPartyDto) {
    return this.partyService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_project_party')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.partyService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project_party')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.partyService.restore(uuid);
  }
}