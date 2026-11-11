import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Patch, Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { DetailsService } from './details.service';
import { CreateDetailsDto } from './dto/create-detail.dto';
import { QueryDetailsDto } from './dto/query-detail.dto';
import { UpdateDetailsDto } from './dto/update-detail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Project | Details")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Post()
  @Permissions('create_projects_details')
  create(
    @Body() dto: CreateDetailsDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.detailsService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_details')
  findAll(
    @Query() query: QueryDetailsDto, @CurrentUser() currentUser: any
  ) {
    return this.detailsService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_details')
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.detailsService.findOne(uuid, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_details')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDetailsDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.detailsService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_details')
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.detailsService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_details')
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.detailsService.restore(uuid, userId, currentUser);
  }
}