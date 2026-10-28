import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEmployeeKpiDto } from './dto/create-employee-kpi.dto';
import { QueryEmployeeKpiDto } from './dto/query-employee-kpi.dto';
import { UpdateEmployeeKpiDto } from './dto/update-employee-kpi.dto';
import { EmployeeKpiService } from './employee-kpi.service';

@ApiTags('CRM | KPI | Employee KPI')
@ApiBearerAuth()
@Controller('crm/kpi/employee-kpi')
export class EmployeeKpiController {
  constructor(private readonly service: EmployeeKpiService) {}

  @Post() @ApiOperation({ summary: 'Create an employee KPI setting' })
  create(@Body() dto: CreateEmployeeKpiDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List employee KPI settings with search, filters and pagination' })
  findAll(@Query() query: QueryEmployeeKpiDto) { return this.service.findAll(query); }

  @Get('dropdowns') @ApiOperation({ summary: 'Get active users, teams and KPI work types for dropdowns' })
  dropdowns() { return this.service.dropdowns(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get an employee KPI setting by UUID' })
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update an employee KPI setting by UUID' })
  update(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body() dto: UpdateEmployeeKpiDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete an employee KPI setting by UUID' })
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body('deletedBy') deletedBy?: string) { return this.service.remove(uuid, deletedBy); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted employee KPI setting by UUID' })
  restore(@Param('uuid', new ParseUUIDPipe()) uuid: string) { return this.service.restore(uuid); }
}
