/* eslint-disable prettier/prettier */

import { 
  Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe
} from '@nestjs/common';
import { ProjectAgreementService } from './project_aggrement.service';
import { CreateProjectAgreementDto } from './dto/create-project_aggrement.dto';
import { UpdateProjectAgreementDto } from './dto/update-project_aggrement.dto';
import { QueryProjectAgreementDto } from './dto/query-project_aggrement.dto';

@Controller('project-agreement')
export class ProjectAgreementController {
  constructor(private readonly agreementService: ProjectAgreementService) {}

  @Post()
  create(@Body() dto: CreateProjectAgreementDto) {
    return this.agreementService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProjectAgreementDto) {
    return this.agreementService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementService.findOne(uuid);
  }

  // ✅ PATCH সাপোর্ট
  @Patch(':uuid')
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateProjectAgreementDto
  ) {
    return this.agreementService.update(uuid, dto);
  }

  // ✅ PUT সাপোর্ট
  @Put(':uuid')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateProjectAgreementDto
  ) {
    return this.agreementService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementService.restore(uuid);
  }
}