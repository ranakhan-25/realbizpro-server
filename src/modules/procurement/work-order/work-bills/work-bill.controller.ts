import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWorkBillDto, QueryWorkBillDto, UpdateWorkBillStatusDto } from './dto/work-bill.dto';
import { WorkBillService } from './work-bill.service';

@ApiTags('Procurement | Work Bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/work-bills')
export class WorkBillController {
  constructor(private readonly service: WorkBillService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Approved, unbilled measurements with their work order, project and vendor' })
  @Permissions('view_procurement_work_bill')
  dropdowns() { return this.service.dropdowns(); }

  @Get() @ApiOperation({ summary: 'List/filter work bills by Bill No and status' })
  @Permissions('view_procurement_work_bill')
  findAll(@Query() query: QueryWorkBillDto) { return this.service.findAll(query); }

  @Post() @ApiOperation({ summary: 'Create a work bill from one approved, not-yet-billed measurement' })
  @Permissions('create_procurement_work_bill')
  create(@Body() dto: CreateWorkBillDto) { return this.service.create(dto); }

  @Get(':uuid') @Permissions('view_procurement_work_bill')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid/status') @Permissions('update_procurement_work_bill')
  updateStatus(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateWorkBillStatusDto) { return this.service.updateStatus(uuid, dto); }
}
