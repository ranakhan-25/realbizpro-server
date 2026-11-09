import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


import { CategoryService } from './category.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@ApiTags('Project | Billing | Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  // CREATE
  @Post()
  @Permissions('create_projects_category')
  @ApiOperation({
    summary: 'Create a new category',
  })
  create(
    @Body() dto: CreateCategoryDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.categoryService.create(dto, userId, currentUser);
  }

  // FIND ALL
  @Get()
  @Permissions('list_projects_category')
  @ApiOperation({
    summary: 'Get all categories (paginated)',
  })
  findAll(
    @Query() query: QueryCategoryDto, @CurrentUser() currentUser: any
  ) {
    return this.categoryService.findAll(query, currentUser);
  }

  // FIND ONE
  @Get(':uuid')
  @Permissions('read_projects_category')
  @ApiOperation({
    summary: 'Get category by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Category UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.categoryService.findOne(uuid, currentUser);
  }

  // UPDATE
  @Patch(':uuid')
  @Permissions('update_projects_category')
  @ApiOperation({
    summary: 'Update category by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Category UUID',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateCategoryDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.categoryService.update(uuid, dto, userId, currentUser);
  }

  // DELETE
  @Delete(':uuid')
  @Permissions('delete_projects_category')
  @ApiOperation({
    summary: 'Delete category by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Category UUID',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.categoryService.remove(uuid, userId, currentUser);
  }

  // RESTORE
  @Patch(':uuid/restore')
  @Permissions('update_projects_category')
  @ApiOperation({
    summary: 'Restore deleted category',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Category UUID',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.categoryService.restore(uuid, userId, currentUser);
  }
}
