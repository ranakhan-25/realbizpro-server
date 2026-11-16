import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ShareConfigurationService } from './share-configuration.service';

import { CreateShareConfigurationDto } from './dto/create-share-configuration.dto';

import { QueryShareConfigurationDto } from './dto/query-share-configuration.dto';

import { UpdateShareConfigurationDto } from './dto/update-share-configuration.dto';

@ApiTags('Project | Investments | Share Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('share-configuration')
export class ShareConfigurationController {
  constructor(
    private readonly shareConfigurationService: ShareConfigurationService,
  ) {}

  @Post()
  @Permissions('create_projects_share_configuration')
  @ApiOperation({
    summary: 'Create a new share configuration',
  })
  create(
    @Body()
    createShareConfigurationDto: CreateShareConfigurationDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.shareConfigurationService.create(createShareConfigurationDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_share_configuration')
  @ApiOperation({
    summary:
      'Get all share configurations (paginated)',
  })
  findAll(
    @Query()
    query: QueryShareConfigurationDto, @CurrentUser() currentUser: any
  ) {
    return this.shareConfigurationService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_share_configuration')
  @ApiOperation({
    summary: 'Get share configuration by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.shareConfigurationService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_share_configuration')
  @ApiOperation({
    summary: 'Update share configuration',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateShareConfigurationDto: UpdateShareConfigurationDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.shareConfigurationService.update(uuid,
      updateShareConfigurationDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_share_configuration')
  @ApiOperation({
    summary:
      'Soft delete share configuration (status → inactive)',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.shareConfigurationService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_share_configuration')
  @ApiOperation({
    summary:
      'Restore soft-deleted share configuration (status → active)',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.shareConfigurationService.restore(uuid, userId, currentUser);
  }
}
