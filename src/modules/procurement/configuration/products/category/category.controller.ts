import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-catefory.dto';

@ApiTags('Procurement | configuration | Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new category with account mapping',
  })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(
      createCategoryDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories (paginated)',
  })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoryService.findAll(query);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Get active procurement categories for dropdowns' })
  @ApiQuery({ name: 'type', required: false, description: 'Optional category type filter' })
  dropdown(@Query('type') type?: string) {
    return this.categoryService.dropdown(type);
  }

  @Get('combined-dropdown')
  @ApiOperation({ summary: 'Get categories from Procurement and Project Billing without merging their stored records' })
  @ApiQuery({ name: 'type', required: false, description: 'Optional category type filter' })
  combinedDropdown(@Query('type') type?: string) {
    return this.categoryService.combinedDropdown(type);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get category by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.categoryService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary:
      'Update category and account mapping',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(
      uuid,
      updateCategoryDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete category',
  })
  remove(@Param('uuid') uuid: string) {
    return this.categoryService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted category',
  })
  restore(@Param('uuid') uuid: string) {
    return this.categoryService.restore(uuid);
  }
}
