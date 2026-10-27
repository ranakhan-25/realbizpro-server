/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import {
  ProjectBillingResource,
} from 'src/database/models/projects/billing/pr_project_billing_record.model';
import { CreateProjectBillingRecordDto } from './dto/create-project-billing-record.dto';
import { QueryProjectBillingRecordDto } from './dto/query-project-billing-record.dto';
import { UpdateProjectBillingRecordDto } from './dto/update-project-billing-record.dto';
import { ProjectBillingRecordService } from './project-billing-record.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

abstract class ProjectBillingResourceController {
  protected constructor(
    private readonly service: ProjectBillingRecordService,
    private readonly resource: ProjectBillingResource,
  ) {}

  protected createRecord(
    dto: CreateProjectBillingRecordDto,
    request: AuthenticatedRequest,
  ) {
    return this.service.create(this.resource, dto, request.user?.id);
  }

  protected listRecords(query: QueryProjectBillingRecordDto) {
    return this.service.findAll(this.resource, query);
  }

  protected getRecord(uuid: string) {
    return this.service.findOne(this.resource, uuid);
  }

  protected updateRecord(
    uuid: string,
    dto: UpdateProjectBillingRecordDto,
    request: AuthenticatedRequest,
  ) {
    return this.service.update(this.resource, uuid, dto, request.user?.id);
  }

  protected deleteRecord(uuid: string) {
    return this.service.remove(this.resource, uuid);
  }
}

@ApiTags('Project Billing | Bill Items')
@ApiBearerAuth()
@Controller('project-billing/bill-items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectBillItemsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.BILL_ITEMS);
  }

  @Post()
  @Permissions('create_bill_item')
  @ApiOperation({ summary: 'Create a bill item' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_bill_items')
  @ApiOperation({ summary: 'List bill items' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_bill_item')
  @ApiOperation({ summary: 'Get a bill item by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_bill_item')
  @ApiOperation({ summary: 'Update a bill item' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_bill_item')
  @ApiOperation({ summary: 'Delete a bill item' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Service Work Names')
@ApiBearerAuth()
@Controller('project-billing/service-work-names')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectServiceWorkNamesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.SERVICE_WORK_NAMES);
  }

  @Post()
  @Permissions('create_service_work_name')
  @ApiOperation({ summary: 'Create a service work name' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_service_work_names')
  @ApiOperation({ summary: 'List service work names' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_service_work_name')
  @ApiOperation({ summary: 'Get a service work name by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_service_work_name')
  @ApiOperation({ summary: 'Update a service work name' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_service_work_name')
  @ApiOperation({ summary: 'Delete a service work name' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Bill Invoices')
@ApiBearerAuth()
@Controller('project-billing/bill-invoices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectBillInvoicesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.BILL_INVOICES);
  }

  @Post()
  @Permissions('create_bill_invoice')
  @ApiOperation({ summary: 'Create a bill invoice' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_bill_invoices')
  @ApiOperation({ summary: 'List bill invoices' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_bill_invoice')
  @ApiOperation({ summary: 'Get a bill invoice by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_bill_invoice')
  @ApiOperation({ summary: 'Update a bill invoice' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_bill_invoice')
  @ApiOperation({ summary: 'Delete a bill invoice' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Contractor Bills')
@ApiBearerAuth()
@Controller('project-billing/contractor-bills')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectContractorBillsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.CONTRACTOR_BILLS);
  }

  @Post()
  @Permissions('create_contractor_bill')
  @ApiOperation({ summary: 'Create a contractor bill' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_contractor_bills')
  @ApiOperation({ summary: 'List contractor bills' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_contractor_bill')
  @ApiOperation({ summary: 'Get a contractor bill by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_contractor_bill')
  @ApiOperation({ summary: 'Update a contractor bill' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_contractor_bill')
  @ApiOperation({ summary: 'Delete a contractor bill' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Labour Work Bills')
@ApiBearerAuth()
@Controller('project-billing/labour-work-bills')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectLabourWorkBillsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.LABOUR_WORK_BILLS);
  }

  @Post()
  @Permissions('create_labour_work_bill')
  @ApiOperation({ summary: 'Create a labour work bill' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get('reports')
  @Permissions('view_labour_work_bill_reports')
  @ApiOperation({ summary: 'List labour work bill report rows' })
  report(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get()
  @Permissions('view_labour_work_bills')
  @ApiOperation({ summary: 'List labour work bills' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_labour_work_bill')
  @ApiOperation({ summary: 'Get a labour work bill by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_labour_work_bill')
  @ApiOperation({ summary: 'Update a labour work bill' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_labour_work_bill')
  @ApiOperation({ summary: 'Delete a labour work bill' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Work Orders')
@ApiBearerAuth()
@Controller('project-billing/work-orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectWorkOrdersController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.WORK_ORDERS);
  }

  @Post()
  @Permissions('create_work_order')
  @ApiOperation({ summary: 'Create a work order' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_work_orders')
  @ApiOperation({ summary: 'List work orders' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_work_order')
  @ApiOperation({ summary: 'Get a work order by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_work_order')
  @ApiOperation({ summary: 'Update a work order' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_work_order')
  @ApiOperation({ summary: 'Delete a work order' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Contractor Work Orders')
@ApiBearerAuth()
@Controller('project-billing/contractor-work-orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectContractorWorkOrdersController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.CONTRACTOR_WORK_ORDERS);
  }

  @Post()
  @Permissions('create_contractor_work_order')
  @ApiOperation({ summary: 'Create a contractor work order' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_contractor_work_orders')
  @ApiOperation({ summary: 'List contractor work orders' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_contractor_work_order')
  @ApiOperation({ summary: 'Get a contractor work order by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_contractor_work_order')
  @ApiOperation({ summary: 'Update a contractor work order' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_contractor_work_order')
  @ApiOperation({ summary: 'Delete a contractor work order' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Period Billings')
@ApiBearerAuth()
@Controller('project-billing/period-billings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectPeriodBillingsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.PERIOD_BILLINGS);
  }

  @Post()
  @Permissions('create_period_billing')
  @ApiOperation({ summary: 'Create a period billing' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_period_billings')
  @ApiOperation({ summary: 'List period billings' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_period_billing')
  @ApiOperation({ summary: 'Get a period billing by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_period_billing')
  @ApiOperation({ summary: 'Update a period billing' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_period_billing')
  @ApiOperation({ summary: 'Delete a period billing' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Adjustment Billings')
@ApiBearerAuth()
@Controller('project-billing/adjustment-billings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectAdjustmentBillingsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.ADJUSTMENT_BILLINGS);
  }

  @Post()
  @Permissions('create_adjustment_billing')
  @ApiOperation({ summary: 'Create an adjustment billing record' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_adjustment_billings')
  @ApiOperation({ summary: 'List adjustment billing records' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_adjustment_billing')
  @ApiOperation({ summary: 'Get an adjustment billing record by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_adjustment_billing')
  @ApiOperation({ summary: 'Update an adjustment billing record' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_adjustment_billing')
  @ApiOperation({ summary: 'Delete an adjustment billing record' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Quotes')
@ApiBearerAuth()
@Controller('project-billing/quotes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectQuotesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.QUOTES);
  }

  @Post()
  @Permissions('create_quote')
  @ApiOperation({ summary: 'Create a project quote' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_quotes')
  @ApiOperation({ summary: 'List project quotes' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @Permissions('view_quote')
  @ApiOperation({ summary: 'Get a project quote by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_quote')
  @ApiOperation({ summary: 'Update a project quote' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_quote')
  @ApiOperation({ summary: 'Delete a project quote' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}
