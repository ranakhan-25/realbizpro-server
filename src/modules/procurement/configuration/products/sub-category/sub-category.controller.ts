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
import { CreateProcurementSubCategoryDto } from './dto/create-sub-category.dto';
import { QueryProcurementSubCategoryDto } from './dto/query-sub-category.dto';
import { UpdateProcurementSubCategoryDto } from './dto/update-sub-category.dto';
import { ProcurementSubCategoryService } from './sub-category.service';

@ApiTags('Procurement | configuration | Sub Category')
@ApiBearerAuth()
@Controller('procurement/sub-category')
export class ProcurementSubCategoryController {
  constructor(
    private readonly subCategoryService: ProcurementSubCategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a procurement sub category' })
  create(@Body() dto: CreateProcurementSubCategoryDto) {
    return this.subCategoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get procurement sub categories' })
  findAll(@Query() query: QueryProcurementSubCategoryDto) {
    return this.subCategoryService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get procurement sub category by UUID' })
  @ApiParam({ name: 'uuid', description: 'Sub category UUID' })
  findOne(@Param('uuid') uuid: string) {
    return this.subCategoryService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update procurement sub category' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProcurementSubCategoryDto,
  ) {
    return this.subCategoryService.update(uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft delete procurement sub category' })
  remove(@Param('uuid') uuid: string) {
    return this.subCategoryService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore procurement sub category' })
  restore(@Param('uuid') uuid: string) {
    return this.subCategoryService.restore(uuid);
  }
}
