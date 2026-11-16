/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnderService } from './under.service';
import { CreateUnderDto } from './dto/create-under.dto';
import { QueryUnderDto } from './dto/query-under.dto';
import { UpdateUnderDto } from './dto/update-under.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Under')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('under')
export class UnderController {
  constructor(private readonly underService: UnderService) {}

  @Post()
  @Permissions('create_under')
  @ApiOperation({ summary: 'Create under' })
  create(
    @Body() dto: CreateUnderDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.underService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_under')
  @ApiOperation({ summary: 'Get all unders (paginated)' })
  findAll(
    @Query() query: QueryUnderDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.underService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_under')
  @ApiOperation({ summary: 'Get under by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.underService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_under')
  @ApiOperation({ summary: 'Update under' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateUnderDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.underService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_under')
  @ApiOperation({ summary: 'Delete under' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.underService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_under')
  @ApiOperation({ summary: 'Restore soft-deleted under' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.underService.restore(uuid, userId, currentUser);
  }
}
