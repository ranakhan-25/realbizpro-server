import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryGrnDto } from './dto/query-grn.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';
import { GrnService } from './grn.service';

@ApiTags('Procurement | Goods Receipt Note (GRN)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/grn')
export class GrnController {
  constructor(private readonly service: GrnService) {}
  @Get() @ApiOperation({ summary: 'List and filter Goods Receipt Notes' }) findAll(@Query() query: QueryGrnDto) { return this.service.findAll(query); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get populated dropdown data for viewing/updating GRNs' }) dropdowns(@Query('project_id') projectId?: string, @Query('category_id') categoryId?: string) { return this.service.dropdowns(projectId, categoryId); }
  @Get(':uuid') @ApiOperation({ summary: 'View one Goods Receipt Note with related records and lines' }) findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') @ApiOperation({ summary: 'Update an existing GRN; already-billed GRNs are locked' }) update(@Param('uuid') uuid: string, @Body() dto: UpdateGrnDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.id ?? req.user?.uuid); }
  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete an existing GRN; already-billed GRNs are locked' }) remove(@Param('uuid') uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.id ?? req.user?.uuid); }
}
