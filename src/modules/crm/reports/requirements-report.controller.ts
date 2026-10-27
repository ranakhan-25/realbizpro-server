import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryRequirementsReportDto } from './dto/query-requirements-report.dto';
import { RequirementsReportService } from './requirements-report.service';

@ApiTags('CRM | Reports | Requirements')
@ApiBearerAuth()
@Controller('crm/reports/requirements')
export class RequirementsReportController {
  constructor(private readonly service: RequirementsReportService) {}

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get users, areas and requirement types for the requirements report' })
  dropdowns() { return this.service.dropdowns(); }

  @Get()
  @ApiOperation({ summary: 'List CRM lead requirements with type, price, size, area, lead, user and description' })
  report(@Query() query: QueryRequirementsReportDto) { return this.service.report(query); }
}
