import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWorkBillDto, QueryWorkBillDto, UpdateWorkBillStatusDto } from './dto/work-bill.dto';
import { WorkBillService } from './work-bill.service';

@ApiTags('Procurement | Work Bills')
@ApiBearerAuth()
@Controller('procurement/work-bills')
export class WorkBillController {
  constructor(private readonly service: WorkBillService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Approved, unbilled measurements with their work order, project and vendor' })
  dropdowns() { return this.service.dropdowns(); }

  @Get() @ApiOperation({ summary: 'List/filter work bills by Bill No and status' })
  findAll(@Query() query: QueryWorkBillDto) { return this.service.findAll(query); }

  @Post() @ApiOperation({ summary: 'Create a work bill from one approved, not-yet-billed measurement' })
  create(@Body() dto: CreateWorkBillDto) { return this.service.create(dto); }

  @Get(':uuid') findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid/status') updateStatus(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateWorkBillStatusDto) { return this.service.updateStatus(uuid, dto); }
}
