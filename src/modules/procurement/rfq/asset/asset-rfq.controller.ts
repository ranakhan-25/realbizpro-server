import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAssetRfqDto } from './dto/create-asset-rfq.dto';
import { QueryAssetRfqDto } from './dto/query-asset-rfq.dto';
import { UpdateAssetRfqDto } from './dto/update-asset-rfq.dto';
import { AssetRfqService } from './asset-rfq.service';

@ApiTags('Procurement | Asset Request for Quotation (RFQ)')
@ApiBearerAuth()
@Controller('procurement/asset-rfq')
export class AssetRfqController {
  constructor(private readonly service: AssetRfqService) {}
  @Post() @ApiOperation({ summary: 'Create asset RFQ with asset item lines' }) create(@Body() dto: CreateAssetRfqDto) { return this.service.create(dto); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get asset RFQ form dropdown data' }) dropdowns(@Query('project_id') projectId?: string, @Query('category_id') categoryId?: string) { return this.service.dropdowns(projectId, categoryId); }
  @Get() @ApiOperation({ summary: 'List and filter asset RFQs' }) findAll(@Query() query: QueryAssetRfqDto) { return this.service.findAll(query); }
  @Get(':uuid') findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') update(@Param('uuid') uuid: string, @Body() dto: UpdateAssetRfqDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') remove(@Param('uuid') uuid: string) { return this.service.remove(uuid); }
  @Patch(':uuid/restore') restore(@Param('uuid') uuid: string) { return this.service.restore(uuid); }
}
