import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMaterialIssueDto, QueryMaterialIssueDto } from './dto/material-issue.dto';
import { MaterialIssueService } from './material-issue.service';

@ApiTags('Procurement | Material Issue')
@ApiBearerAuth()
@Controller('procurement/material-issues')
export class MaterialIssueController {
  constructor(private readonly service: MaterialIssueService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Fully approved GRNs with remaining issuable quantities and user options' })
  dropdowns() { return this.service.dropdowns(); }

  @Get('trash') trash(@Query() query: QueryMaterialIssueDto) { return this.service.findAll(query, true); }
  @Get() @ApiOperation({ summary: 'List/filter material issues by GRN number, date range, sorting and status' })
  findAll(@Query() query: QueryMaterialIssueDto) { return this.service.findAll(query); }

  @Post() @ApiOperation({ summary: 'Issue GRN materials; validates available quantity and records issuer' })
  create(@Body() dto: CreateMaterialIssueDto, @Req() req: any) { return this.service.create(dto, req.user?.id); }

  @Get(':uuid') findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid/cancel') cancel(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.cancel(uuid); }
  @Delete(':uuid') remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }
}
