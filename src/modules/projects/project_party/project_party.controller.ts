/* eslint-disable prettier/prettier */

import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe
} from '@nestjs/common';
import { ProjectPartyService } from './project_party.service';
import { CreateProjectPartyDto } from './dto/create-project_party.dto';
import { QueryProjectPartyDto } from './dto/query-project_party.dto';
import { UpdateProjectPartyDto } from './dto/update-project_party.dto';


@Controller('project-parties')
export class ProjectPartyController {
  constructor(private readonly partyService: ProjectPartyService) {}

  @Post()
  create(@Body() dto: CreateProjectPartyDto) {
    return this.partyService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProjectPartyDto) {
    return this.partyService.findAll(query);
  }

  @Get('summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.partyService.getSummary(projectUuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.partyService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateProjectPartyDto) {
    return this.partyService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.partyService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.partyService.restore(uuid);
  }
}