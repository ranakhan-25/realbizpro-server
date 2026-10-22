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
  ApiTags,
} from '@nestjs/swagger';
import { CreateProcurementAssetCategoryDto } from './dto/create-asset-category.dto';
import { QueryProcurementAssetCategoryDto } from './dto/query-asset-category.dto';
import { UpdateProcurementAssetCategoryDto } from './dto/update-asset-category.dto';
import { ProcurementAssetCategoryService } from './asset-category.service';

@ApiTags(
  'Procurement | Configuration | Asset Category',
)
@ApiBearerAuth()
@Controller('procurement/asset-category')
export class ProcurementAssetCategoryController {
  constructor(
    private readonly service: ProcurementAssetCategoryService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create an asset category',
  })
  create(
    @Body()
    dto: CreateProcurementAssetCategoryDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List asset categories (paginated)',
  })
  findAll(
    @Query()
    query: QueryProcurementAssetCategoryDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get asset category by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update asset category',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    dto: UpdateProcurementAssetCategoryDto,
  ) {
    return this.service.update(uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft-delete asset category',
  })
  remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore asset category',
  })
  restore(@Param('uuid') uuid: string) {
    return this.service.restore(uuid);
  }
}
