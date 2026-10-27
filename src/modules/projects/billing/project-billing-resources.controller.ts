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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
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
export class ProjectBillItemsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.BILL_ITEMS);
  }

  @Post()
  @ApiOperation({ summary: 'Create a bill item' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List bill items' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a bill item by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a bill item' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a bill item' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Service Work Names')
@ApiBearerAuth()
@Controller('project-billing/service-work-names')
export class ProjectServiceWorkNamesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.SERVICE_WORK_NAMES);
  }

  @Post()
  @ApiOperation({ summary: 'Create a service work name' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List service work names' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a service work name by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a service work name' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a service work name' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Bill Invoices')
@ApiBearerAuth()
@Controller('project-billing/bill-invoices')
export class ProjectBillInvoicesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.BILL_INVOICES);
  }

  @Post()
  @ApiOperation({ summary: 'Create a bill invoice' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List bill invoices' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a bill invoice by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a bill invoice' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a bill invoice' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Contractor Bills')
@ApiBearerAuth()
@Controller('project-billing/contractor-bills')
export class ProjectContractorBillsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.CONTRACTOR_BILLS);
  }

  @Post()
  @ApiOperation({ summary: 'Create a contractor bill' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List contractor bills' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a contractor bill by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a contractor bill' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a contractor bill' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Labour Work Bills')
@ApiBearerAuth()
@Controller('project-billing/labour-work-bills')
export class ProjectLabourWorkBillsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.LABOUR_WORK_BILLS);
  }

  @Post()
  @ApiOperation({ summary: 'Create a labour work bill' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get('reports')
  @ApiOperation({ summary: 'List labour work bill report rows' })
  report(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get()
  @ApiOperation({ summary: 'List labour work bills' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a labour work bill by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a labour work bill' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a labour work bill' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Work Orders')
@ApiBearerAuth()
@Controller('project-billing/work-orders')
export class ProjectWorkOrdersController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.WORK_ORDERS);
  }

  @Post()
  @ApiOperation({ summary: 'Create a work order' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List work orders' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a work order by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a work order' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a work order' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Contractor Work Orders')
@ApiBearerAuth()
@Controller('project-billing/contractor-work-orders')
export class ProjectContractorWorkOrdersController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.CONTRACTOR_WORK_ORDERS);
  }

  @Post()
  @ApiOperation({ summary: 'Create a contractor work order' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List contractor work orders' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a contractor work order by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a contractor work order' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a contractor work order' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Period Billings')
@ApiBearerAuth()
@Controller('project-billing/period-billings')
export class ProjectPeriodBillingsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.PERIOD_BILLINGS);
  }

  @Post()
  @ApiOperation({ summary: 'Create a period billing' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List period billings' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a period billing by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a period billing' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a period billing' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Adjustment Billings')
@ApiBearerAuth()
@Controller('project-billing/adjustment-billings')
export class ProjectAdjustmentBillingsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.ADJUSTMENT_BILLINGS);
  }

  @Post()
  @ApiOperation({ summary: 'Create an adjustment billing record' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List adjustment billing records' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get an adjustment billing record by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update an adjustment billing record' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete an adjustment billing record' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Project Billing | Quotes')
@ApiBearerAuth()
@Controller('project-billing/quotes')
export class ProjectQuotesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.QUOTES);
  }

  @Post()
  @ApiOperation({ summary: 'Create a project quote' })
  create(@Body() dto: CreateProjectBillingRecordDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List project quotes' })
  findAll(@Query() query: QueryProjectBillingRecordDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project quote by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a project quote' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a project quote' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}
