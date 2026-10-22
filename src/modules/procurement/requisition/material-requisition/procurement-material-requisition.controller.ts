import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProcurementMaterialRequisitionDto } from './dto/create-procurement-material-requisition.dto';
import { QueryProcurementMaterialRequisitionDto } from './dto/query-procurement-material-requisition.dto';
import { UpdateProcurementMaterialRequisitionDto } from './dto/update-procurement-material-requisition.dto';
import { ProcurementMaterialRequisitionService } from './procurement-material-requisition.service';

@ApiTags('Procurement | Requisition | Material Requisition')
@ApiBearerAuth()
@Controller('procurement/requisition/material')
export class ProcurementMaterialRequisitionController {
  constructor(private readonly service: ProcurementMaterialRequisitionService) {}
  @Post() @ApiOperation({ summary: 'Create procurement material requisition with item details' }) create(@Body() dto: CreateProcurementMaterialRequisitionDto, @Req() req: any) { return this.service.create(dto, req.user?.id ?? req.user?.uuid); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get material requisition form dropdowns' }) dropdowns(@Query('project_id') projectId?: string, @Query('category_id') categoryId?: string) { return this.service.dropdowns(projectId, categoryId); }
  @Get() @ApiOperation({ summary: 'List/filter procurement material requisitions' }) findAll(@Query() query: QueryProcurementMaterialRequisitionDto) { return this.service.findAll(query); }
  @Get(':uuid') findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') update(@Param('uuid') uuid: string, @Body() dto: UpdateProcurementMaterialRequisitionDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.id ?? req.user?.uuid); }
  @Delete(':uuid') remove(@Param('uuid') uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.id ?? req.user?.uuid); }
  @Patch(':uuid/restore') restore(@Param('uuid') uuid: string) { return this.service.restore(uuid); }
}
