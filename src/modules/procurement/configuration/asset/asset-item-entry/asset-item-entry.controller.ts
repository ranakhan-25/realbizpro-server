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
import { CreateProcurementAssetItemEntryDto } from './dto/create-asset-item-entry.dto';
import { QueryProcurementAssetItemEntryDto } from './dto/query-asset-item-entry.dto';
import { UpdateProcurementAssetItemEntryDto } from './dto/update-asset-item-entry.dto';
import { ProcurementAssetItemEntryService } from './asset-item-entry.service';

@ApiTags(
  'Procurement | Configuration | Asset Item Entry',
)
@ApiBearerAuth()
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

  @Get(':uuid') findOne(
    @Param('uuid') uuid: string,
  ) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid') update(
    @Param('uuid') uuid: string,
    @Body()
    dto: UpdateProcurementAssetItemEntryDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid') remove(
    @Param('uuid') uuid: string,
  ) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore') restore(
    @Param('uuid') uuid: string,
  ) {
    return this.service.restore(uuid);
  }
}
