import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEmployeeKpiDto } from './dto/create-employee-kpi.dto';
import { QueryEmployeeKpiDto } from './dto/query-employee-kpi.dto';
import { UpdateEmployeeKpiDto } from './dto/update-employee-kpi.dto';
import { EmployeeKpiService } from './employee-kpi.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | KPI | Employee KPI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/kpi/employee-kpi')
export class EmployeeKpiController {
  constructor(private readonly service: EmployeeKpiService) {}

  @Post()
  @Permissions('create_crm_employee_kpi')
  @ApiOperation({ summary: 'Create an employee KPI setting' })
  create(
    @Body() dto: CreateEmployeeKpiDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_employee_kpi')
  @ApiOperation({ summary: 'List employee KPI settings with search, filters and pagination' })
  findAll(
    @Query() query: QueryEmployeeKpiDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_crm_employee_kpi')
  @ApiOperation({ summary: 'Get active users, teams and KPI work types for dropdowns' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_employee_kpi')
  @ApiOperation({ summary: 'Get an employee KPI setting by UUID' })
  findOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_employee_kpi')
  @ApiOperation({ summary: 'Update an employee KPI setting by UUID' })
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateEmployeeKpiDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_employee_kpi')
  @ApiOperation({ summary: 'Soft delete an employee KPI setting by UUID' })
  remove(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_employee_kpi')
  @ApiOperation({ summary: 'Restore a soft-deleted employee KPI setting by UUID' })
  restore(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
