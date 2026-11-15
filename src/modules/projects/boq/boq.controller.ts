import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BoqService } from './boq.service';
import { CreateBoqDto } from './dto/create-boq.dto';
import { QueryBoqDto } from './dto/query-boq.dto';
import { UpdateBoqDto } from './dto/update-boq.dto';

@ApiTags('Projects | BOQ')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('boq')
export class BoqController {
  constructor(
    private readonly boqService: BoqService,
  ) {}

  @Post()
  @Permissions('create_projects_boq')
  @ApiOperation({
    summary: 'Create a new BOQ',
  })
  create(
    @Body()
    createBoqDto: CreateBoqDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.boqService.create(createBoqDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_boq')
  @ApiOperation({
    summary: 'Get all BOQs (paginated)',
  })
  findAll(
    @Query()
    query: QueryBoqDto, @CurrentUser() currentUser: any
  ) {
    return this.boqService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_boq')
  @ApiOperation({
    summary: 'Get BOQ by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.boqService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_boq')
  @ApiOperation({
    summary: 'Update BOQ',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateBoqDto: UpdateBoqDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.boqService.update(uuid,
      updateBoqDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_boq')
  @ApiOperation({
    summary: 'Soft delete BOQ',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.boqService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_boq')
  @ApiOperation({
    summary: 'Restore soft-deleted BOQ',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.boqService.restore(uuid, userId, currentUser);
  }
}
