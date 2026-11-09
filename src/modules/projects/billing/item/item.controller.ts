import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemDto } from './dto/query-item.dto';

@ApiTags('Project | Billing | Item')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
  ) {}

  @Post()
  @Permissions('create_projects_item')
  @ApiOperation({ summary: 'Create a new item' })
  create(
    @Body() dto: CreateItemDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.itemService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_item')
  @ApiOperation({
    summary: 'Get all items (paginated)',
  })
  findAll(
    @Query() query: QueryItemDto, @CurrentUser() currentUser: any
  ) {
    return this.itemService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_item')
  @ApiOperation({ summary: 'Get item by UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'Item UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.itemService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_item')
  @ApiOperation({
    summary: 'Update item by UUID',
  })
  @ApiParam({ name: 'uuid' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateItemDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.itemService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_item')
  @ApiOperation({
    summary: 'Delete item by UUID',
  })
  @ApiParam({ name: 'uuid' })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.itemService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_item')
  @ApiOperation({
    summary: 'Restore deleted item',
  })
  @ApiParam({ name: 'uuid' })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.itemService.restore(uuid, userId, currentUser);
  }
}
