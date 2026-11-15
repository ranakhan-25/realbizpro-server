import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { QuerySubCategoryDto } from './dto/query-sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@ApiTags('Project | Billing | Sub Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('billing-sub-category')
export class SubCategoryController {
  constructor(
    private readonly billingSubCategoryService: SubCategoryService,
  ) {}

  // CREATE
  @Post()
  @Permissions('create_projects_sub_category')
  @ApiOperation({
    summary: 'Create a new billing sub category',
  })
  create(
    @Body() dto: CreateSubCategoryDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billingSubCategoryService.create(dto, userId, currentUser);
  }

  // GET ALL
  @Get()
  @Permissions('list_projects_sub_category')
  @ApiOperation({
    summary: 'Get all billing sub categories',
  })
  findAll(
    @Query() query: QuerySubCategoryDto, @CurrentUser() currentUser: any
  ) {
    return this.billingSubCategoryService.findAll(query, currentUser);
  }

  // GET ONE
  @Get(':uuid')
  @Permissions('read_projects_sub_category')
  @ApiOperation({
    summary: 'Get billing sub category by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Billing sub category UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.billingSubCategoryService.findOne(uuid, currentUser);
  }

  // UPDATE
  @Patch(':uuid')
  @Permissions('update_projects_sub_category')
  @ApiOperation({
    summary: 'Update billing sub category',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Billing sub category UUID',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSubCategoryDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billingSubCategoryService.update(uuid,
      dto, userId, currentUser);
  }

  // DELETE
  @Delete(':uuid')
  @Permissions('delete_projects_sub_category')
  @ApiOperation({
    summary: 'Delete billing sub category',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Billing sub category UUID',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billingSubCategoryService.remove(uuid, userId, currentUser);
  }

  // RESTORE
  @Patch(':uuid/restore')
  @Permissions('update_projects_sub_category')
  @ApiOperation({
    summary:
      'Restore deleted billing sub category',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Billing sub category UUID',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billingSubCategoryService.restore(uuid, userId, currentUser);
  }
}
