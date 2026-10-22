import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssetGrnService } from './asset-grn.service';
import { CreateAssetGrnDto, UpdateAssetGrnDto } from './dto/asset-grn.dto';
import { QueryAssetGrnDto } from './dto/query-asset-grn.dto';

@ApiTags('Procurement | Asset Goods Receipt Note(GRN)')
@ApiBearerAuth()
@Controller('procurement/asset-grn')
export class AssetGrnController {
  constructor(private readonly service: AssetGrnService) {}

  @Get() @ApiOperation({ summary: 'List and filter Asset GRNs' }) findAll(@Query() query: QueryAssetGrnDto) { return this.service.findAll(query); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get dropdown data for Asset GRN form' }) dropdowns(@Query('project_id') projectId?: string, @Query('category_id') categoryId?: string) { return this.service.dropdowns(projectId, categoryId); }
  @Get(':uuid') @ApiOperation({ summary: 'View one Asset GRN with related records and lines' }) findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Post() @ApiOperation({ summary: 'Create an Asset GRN' }) create(@Body() dto: CreateAssetGrnDto, @Req() req: any) { return this.service.create(dto, req.user?.id ?? req.user?.uuid); }
  @Patch(':uuid') @ApiOperation({ summary: 'Update an Asset GRN' }) update(@Param('uuid') uuid: string, @Body() dto: UpdateAssetGrnDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.id ?? req.user?.uuid); }
  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete an Asset GRN' }) remove(@Param('uuid') uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.id ?? req.user?.uuid); }
}
