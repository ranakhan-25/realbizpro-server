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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';


import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { QuerySubCategoryDto } from './dto/query-sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@ApiTags('Billing | Sub Category')
@ApiBearerAuth()
@Controller('billing-sub-category')
export class SubCategoryController {
  constructor(
    private readonly billingSubCategoryService: SubCategoryService,
  ) {}

  // CREATE
  @Post()
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
