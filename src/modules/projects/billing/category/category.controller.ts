/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

import { CategoryService } from './category.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@ApiTags('Project | Billing | Category')
@ApiBearerAuth()
@Controller('category')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  // CREATE
  @Post()
  @Permissions('create_category')
  @ApiOperation({
    summary: 'Create a new category',
  })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  // FIND ALL
  @Get()
  @Permissions('view_categories')
  @ApiOperation({
    summary: 'Get all categories (paginated)',
  })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoryService.findAll(query);
  }

  // FIND ONE
  @Get(':uuid')
  @Permissions('view_category')
  @ApiOperation({
    summary: 'Get category by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Category UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.categoryService.findOne(uuid);
  }

  // UPDATE
  @Patch(':uuid')
  @Permissions('update_category')
  @ApiOperation({
    summary: 'Update category by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Category UUID',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(uuid, dto);
  }

  // DELETE
  @Delete(':uuid')
  @Permissions('delete_category')
  @ApiOperation({
    summary: 'Delete category by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Category UUID',
  })
  remove(@Param('uuid') uuid: string) {
    return this.categoryService.remove(uuid);
  }

  // RESTORE
  @Patch(':uuid/restore')
  @Permissions('restore_category')
  @ApiOperation({
    summary: 'Restore deleted category',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Category UUID',
  })
  restore(@Param('uuid') uuid: string) {
    return this.categoryService.restore(uuid);
  }
}
