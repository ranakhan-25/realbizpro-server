import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProcurementSubCategoryDto } from './dto/create-sub-category.dto';
import { QueryProcurementSubCategoryDto } from './dto/query-sub-category.dto';
import { UpdateProcurementSubCategoryDto } from './dto/update-sub-category.dto';
import { ProcurementSubCategoryService } from './sub-category.service';

@ApiTags('Procurement | configuration | Sub Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/sub-category')
export class ProcurementSubCategoryController {
  constructor(
    private readonly subCategoryService: ProcurementSubCategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a procurement sub category' })
  @Permissions('create_procurement_sub_category')
  create(@Body() dto: CreateProcurementSubCategoryDto) {
    return this.subCategoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get procurement sub categories' })
  @Permissions('view_procurement_sub_category')
  findAll(@Query() query: QueryProcurementSubCategoryDto) {
    return this.subCategoryService.findAll(query);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Get active procurement sub categories for dropdowns' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Optional parent category UUID' })
  dropdown(@Query('categoryId') categoryId?: string) {
    return this.subCategoryService.dropdown(categoryId);
  }

  @Get('combined-dropdown')
  @ApiOperation({ summary: 'Get sub categories from Procurement and Project Billing as a read-only combined list' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Optional parent category UUID' })
  combinedDropdown(@Query('categoryId') categoryId?: string) {
    return this.subCategoryService.combinedDropdown(categoryId);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get procurement sub category by UUID' })
  @ApiParam({ name: 'uuid', description: 'Sub category UUID' })
  findOne(@Param('uuid') uuid: string) {
    return this.subCategoryService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update procurement sub category' })
  @Permissions('update_procurement_sub_category')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProcurementSubCategoryDto,
  ) {
    return this.subCategoryService.update(uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft delete procurement sub category' })
  @Permissions('delete_procurement_sub_category')
  remove(@Param('uuid') uuid: string) {
    return this.subCategoryService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore procurement sub category' })
  @Permissions('update_procurement_sub_category')
  restore(@Param('uuid') uuid: string) {
    return this.subCategoryService.restore(uuid);
  }
}
