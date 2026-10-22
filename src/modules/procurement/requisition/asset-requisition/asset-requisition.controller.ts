import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAssetRequisitionDto } from './dto/create-asset-requisition.dto';
import { QueryAssetRequisitionDto } from './dto/query-asset-requisition.dto';
import { UpdateAssetRequisitionDto } from './dto/update-asset-requisition.dto';
import { AssetRequisitionService } from './asset-requisition.service';

@ApiTags('Procurement | Requisition | Asset Requisition')
@ApiBearerAuth()
@Controller('procurement/requisition/asset')
export class AssetRequisitionController {
  constructor(private readonly service: AssetRequisitionService) {}
  @Post() @ApiOperation({ summary: 'Create asset requisition with asset item lines' }) create(@Body() dto: CreateAssetRequisitionDto, @Req() req: any) { return this.service.create(dto, req.user?.id ?? req.user?.uuid); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get asset requisition form dropdown data' }) dropdowns(@Query('project_id') projectId?: string, @Query('category_id') categoryId?: string) { return this.service.dropdowns(projectId, categoryId); }
  @Get() @ApiOperation({ summary: 'List/filter asset requisitions' }) findAll(@Query() query: QueryAssetRequisitionDto) { return this.service.findAll(query); }
  @Get(':uuid') findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') update(@Param('uuid') uuid: string, @Body() dto: UpdateAssetRequisitionDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.id ?? req.user?.uuid); }
  @Delete(':uuid') remove(@Param('uuid') uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.id ?? req.user?.uuid); }
  @Patch(':uuid/restore') restore(@Param('uuid') uuid: string) { return this.service.restore(uuid); }
}
