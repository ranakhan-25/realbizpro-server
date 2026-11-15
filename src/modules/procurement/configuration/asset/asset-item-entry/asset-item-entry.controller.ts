import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProcurementAssetItemEntryDto } from './dto/create-asset-item-entry.dto';
import { QueryProcurementAssetItemEntryDto } from './dto/query-asset-item-entry.dto';
import { UpdateProcurementAssetItemEntryDto } from './dto/update-asset-item-entry.dto';
import { ProcurementAssetItemEntryService } from './asset-item-entry.service';

@ApiTags(
  'Procurement | Configuration | Asset Item Entry',
)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/asset-item-entry')
export class ProcurementAssetItemEntryController {
  constructor(
    private readonly service: ProcurementAssetItemEntryService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create an asset item entry',
  })
  create(
    @Body()
    dto: CreateProcurementAssetItemEntryDto,
  ) {
    return this.service.create(dto);
  }

  @Get('dropdowns')
  @ApiOperation({
    summary:
      'Get asset category, brand and unit dropdown options',
  })
  dropdowns() {
    return this.service.dropdowns();
  }

  @Get()
  @ApiOperation({
    summary:
      'List asset items (paginated with related names)',
  })
  findAll(
    @Query()
    query: QueryProcurementAssetItemEntryDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':uuid') @Permissions('view_procurement_asset_item_entry')
  findOne(
    @Param('uuid') uuid: string,
  ) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid') @Permissions('update_procurement_asset_item_entry')
  update(
    @Param('uuid') uuid: string,
    @Body()
    dto: UpdateProcurementAssetItemEntryDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid') @Permissions('delete_procurement_asset_item_entry')
  remove(
    @Param('uuid') uuid: string,
  ) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore') @Permissions('update_procurement_asset_item_entry')
  restore(
    @Param('uuid') uuid: string,
  ) {
    return this.service.restore(uuid);
  }
}
