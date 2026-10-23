import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryWorkOrderMeasurementDto } from './dto/query-work-order-measurement.dto';
import { WorkOrderMeasurementService } from './work-order-measurement.service';

@ApiTags('Procurement | Work Orders | Measurements')
@ApiBearerAuth()
@Controller('procurement/work-order-measurements')
export class WorkOrderMeasurementController {
  constructor(private readonly service: WorkOrderMeasurementService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Project, work-order and existing measurement status filter data' })
  dropdowns() { return this.service.dropdowns(); }

  @Get() @ApiOperation({ summary: 'List/filter work-order measurements with related work order and project' })
  findAll(@Query() query: QueryWorkOrderMeasurementDto) { return this.service.findAll(query); }

  @Get(':uuid') @ApiOperation({ summary: 'View a work-order measurement and its related records' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
}
