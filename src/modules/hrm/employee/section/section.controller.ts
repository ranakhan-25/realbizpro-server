/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { QuerySectionDto } from './dto/query-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Section')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @Permissions('create_section')
  @ApiOperation({ summary: 'Create section' })
  create(
    @Body() dto: CreateSectionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.sectionService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_section')
  @ApiOperation({ summary: 'Get all sections (paginated)' })
  findAll(
    @Query() query: QuerySectionDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.sectionService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_section')
  @ApiOperation({ summary: 'Get section by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.sectionService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_section')
  @ApiOperation({ summary: 'Update section' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSectionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.sectionService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_section')
  @ApiOperation({ summary: 'Delete section' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.sectionService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_section')
  @ApiOperation({ summary: 'Restore soft-deleted section' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.sectionService.restore(uuid, userId, currentUser);
  }
}
