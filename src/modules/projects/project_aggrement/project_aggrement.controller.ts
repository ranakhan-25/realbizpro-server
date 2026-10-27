/* eslint-disable prettier/prettier */

import { 
  Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ProjectAgreementService } from './project_aggrement.service';
import { CreateProjectAgreementDto } from './dto/create-project_aggrement.dto';
import { UpdateProjectAgreementDto } from './dto/update-project_aggrement.dto';
import { QueryProjectAgreementDto } from './dto/query-project_aggrement.dto';

@Controller('project-agreement')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectAgreementController {
  constructor(private readonly agreementService: ProjectAgreementService) {}

  @Post()
  @Permissions('create_project_agreement')
  create(@Body() dto: CreateProjectAgreementDto) {
    return this.agreementService.create(dto);
  }

  @Get()
  @Permissions('view_project_agreements')
  findAll(@Query() query: QueryProjectAgreementDto) {
    return this.agreementService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project_agreement')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementService.findOne(uuid);
  }

  // ✅ PATCH সাপোর্ট
  @Patch(':uuid')
  @Permissions('update_project_agreement')
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateProjectAgreementDto
  ) {
    return this.agreementService.update(uuid, dto);
  }

  // ✅ PUT সাপোর্ট
  @Put(':uuid')
  @Permissions('update_project_agreement')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateProjectAgreementDto
  ) {
    return this.agreementService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_project_agreement')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project_agreement')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementService.restore(uuid);
  }
}