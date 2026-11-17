import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMaterialIssueDto, QueryMaterialIssueDto } from './dto/material-issue.dto';
import { MaterialIssueService } from './material-issue.service';

@ApiTags('Procurement | Material Issue')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/material-issues')
export class MaterialIssueController {
  constructor(private readonly service: MaterialIssueService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Fully approved GRNs with remaining issuable quantities and user options' })
  @Permissions('view_procurement_material_issue')
  dropdowns() { return this.service.dropdowns(); }

  @Get('trash') @Permissions('view_procurement_material_issue')
  trash(@Query() query: QueryMaterialIssueDto) { return this.service.findAll(query, true); }
  @Get() @ApiOperation({ summary: 'List/filter material issues by GRN number, date range, sorting and status' })
  @Permissions('view_procurement_material_issue')
  findAll(@Query() query: QueryMaterialIssueDto) { return this.service.findAll(query); }

  @Post() @ApiOperation({ summary: 'Issue GRN materials; validates available quantity and records issuer' })
  @Permissions('create_procurement_material_issue')
  create(@Body() dto: CreateMaterialIssueDto, @Req() req: any) { return this.service.create(dto, req.user?.id); }

  @Get(':uuid') @Permissions('view_procurement_material_issue')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid/cancel') @Permissions('update_procurement_material_issue')
  cancel(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.cancel(uuid); }
  @Delete(':uuid') @Permissions('delete_procurement_material_issue')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }
}
