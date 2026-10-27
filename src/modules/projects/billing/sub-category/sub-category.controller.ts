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

import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { QuerySubCategoryDto } from './dto/query-sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@ApiTags('Project | Billing | Sub Category')
@ApiBearerAuth()
@Controller('billing-sub-category')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SubCategoryController {
  constructor(
    private readonly billingSubCategoryService: SubCategoryService,
  ) {}

  // CREATE
  @Post()
  @Permissions('create_billing_sub_category')
  @ApiOperation({
    summary: 'Create a new billing sub category',
  })
  create(@Body() dto: CreateSubCategoryDto) {
    return this.billingSubCategoryService.create(
      dto,
    );
  }

  // GET ALL
  @Get()
  @Permissions('view_billing_sub_categories')
  @ApiOperation({
    summary: 'Get all billing sub categories',
  })
  findAll(@Query() query: QuerySubCategoryDto) {
    return this.billingSubCategoryService.findAll(
      query,
    );
  }

  // GET ONE
  @Get(':uuid')
  @Permissions('view_billing_sub_category')
  @ApiOperation({
    summary: 'Get billing sub category by UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Billing sub category UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.billingSubCategoryService.findOne(
      uuid,
    );
  }

  // UPDATE
  @Patch(':uuid')
  @Permissions('update_billing_sub_category')
  @ApiOperation({
    summary: 'Update billing sub category',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Billing sub category UUID',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.billingSubCategoryService.update(
      uuid,
      dto,
    );
  }

  // DELETE
  @Delete(':uuid')
  @Permissions('delete_billing_sub_category')
  @ApiOperation({
    summary: 'Delete billing sub category',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Billing sub category UUID',
  })
  remove(@Param('uuid') uuid: string) {
    return this.billingSubCategoryService.remove(
      uuid,
    );
  }

  // RESTORE
  @Patch(':uuid/restore')
  @Permissions('restore_billing_sub_category')
  @ApiOperation({
    summary:
      'Restore deleted billing sub category',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Billing sub category UUID',
  })
  restore(@Param('uuid') uuid: string) {
    return this.billingSubCategoryService.restore(
      uuid,
    );
  }
}
