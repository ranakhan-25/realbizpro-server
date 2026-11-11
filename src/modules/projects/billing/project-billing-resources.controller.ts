/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import {
  ProjectBillingResource,
} from 'src/database/models/projects/billing/pr_project_billing_record.model';
import { CreateProjectBillingRecordDto } from './dto/create-project-billing-record.dto';
import { QueryProjectBillingRecordDto } from './dto/query-project-billing-record.dto';
import { UpdateProjectBillingRecordDto } from './dto/update-project-billing-record.dto';
import { ProjectBillingRecordService } from './project-billing-record.service';

abstract class ProjectBillingResourceController {
  protected constructor(
    private readonly service: ProjectBillingRecordService,
    private readonly resource: ProjectBillingResource,
  ) {}

  protected createRecord(
    dto: CreateProjectBillingRecordDto,
    userId?: number,
    currentUser?: any,
  ) {
    return this.service.create(this.resource, dto, userId, currentUser);
  }

  protected listRecords(query: QueryProjectBillingRecordDto, currentUser?: any) {
    return this.service.findAll(this.resource, query, currentUser);
  }

  protected getRecord(uuid: string, currentUser?: any) {
    return this.service.findOne(this.resource, uuid, currentUser);
  }

  protected updateRecord(
    uuid: string,
    dto: UpdateProjectBillingRecordDto,
    userId?: number,
    currentUser?: any,
  ) {
    return this.service.update(this.resource, uuid, dto, userId, currentUser);
  }

  protected deleteRecord(uuid: string, userId?: number, currentUser?: any) {
    return this.service.remove(this.resource, uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Bill Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/bill-items')
export class ProjectBillItemsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.BILL_ITEMS);
  }

  @Post()
  @Permissions('create_projects_project_bill_items')
  @ApiOperation({ summary: 'Create a bill item' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_bill_items')
  @ApiOperation({ summary: 'List bill items' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_bill_items')
  @ApiOperation({ summary: 'Get a bill item by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_bill_items')
  @ApiOperation({ summary: 'Update a bill item' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_bill_items')
  @ApiOperation({ summary: 'Delete a bill item' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Service Work Names')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/service-work-names')
export class ProjectServiceWorkNamesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.SERVICE_WORK_NAMES);
  }

  @Post()
  @Permissions('create_projects_project_service_work_names')
  @ApiOperation({ summary: 'Create a service work name' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_service_work_names')
  @ApiOperation({ summary: 'List service work names' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_service_work_names')
  @ApiOperation({ summary: 'Get a service work name by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_service_work_names')
  @ApiOperation({ summary: 'Update a service work name' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_service_work_names')
  @ApiOperation({ summary: 'Delete a service work name' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Bill Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/bill-invoices')
export class ProjectBillInvoicesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.BILL_INVOICES);
  }

  @Post()
  @Permissions('create_projects_project_bill_invoices')
  @ApiOperation({ summary: 'Create a bill invoice' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_bill_invoices')
  @ApiOperation({ summary: 'List bill invoices' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_bill_invoices')
  @ApiOperation({ summary: 'Get a bill invoice by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_bill_invoices')
  @ApiOperation({ summary: 'Update a bill invoice' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_bill_invoices')
  @ApiOperation({ summary: 'Delete a bill invoice' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Contractor Bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/contractor-bills')
export class ProjectContractorBillsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.CONTRACTOR_BILLS);
  }

  @Post()
  @Permissions('create_projects_project_contractor_bills')
  @ApiOperation({ summary: 'Create a contractor bill' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_contractor_bills')
  @ApiOperation({ summary: 'List contractor bills' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_contractor_bills')
  @ApiOperation({ summary: 'Get a contractor bill by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_contractor_bills')
  @ApiOperation({ summary: 'Update a contractor bill' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_contractor_bills')
  @ApiOperation({ summary: 'Delete a contractor bill' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Labour Work Bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/labour-work-bills')
export class ProjectLabourWorkBillsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.LABOUR_WORK_BILLS);
  }

  @Post()
  @Permissions('create_projects_project_labour_work_bills')
  @ApiOperation({ summary: 'Create a labour work bill' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get('reports')
  @Permissions('read_projects_project_labour_work_bills')
  @ApiOperation({ summary: 'List labour work bill report rows' })
  report(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_labour_work_bills')
  @ApiOperation({ summary: 'List labour work bills' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_labour_work_bills')
  @ApiOperation({ summary: 'Get a labour work bill by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_labour_work_bills')
  @ApiOperation({ summary: 'Update a labour work bill' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_labour_work_bills')
  @ApiOperation({ summary: 'Delete a labour work bill' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Work Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/work-orders')
export class ProjectWorkOrdersController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.WORK_ORDERS);
  }

  @Post()
  @Permissions('create_projects_project_work_orders')
  @ApiOperation({ summary: 'Create a work order' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_work_orders')
  @ApiOperation({ summary: 'List work orders' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_work_orders')
  @ApiOperation({ summary: 'Get a work order by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_work_orders')
  @ApiOperation({ summary: 'Update a work order' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_work_orders')
  @ApiOperation({ summary: 'Delete a work order' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Contractor Work Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/contractor-work-orders')
export class ProjectContractorWorkOrdersController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.CONTRACTOR_WORK_ORDERS);
  }

  @Post()
  @Permissions('create_projects_project_contractor_work_orders')
  @ApiOperation({ summary: 'Create a contractor work order' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_contractor_work_orders')
  @ApiOperation({ summary: 'List contractor work orders' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_contractor_work_orders')
  @ApiOperation({ summary: 'Get a contractor work order by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_contractor_work_orders')
  @ApiOperation({ summary: 'Update a contractor work order' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_contractor_work_orders')
  @ApiOperation({ summary: 'Delete a contractor work order' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Period Billings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/period-billings')
export class ProjectPeriodBillingsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.PERIOD_BILLINGS);
  }

  @Post()
  @Permissions('create_projects_project_period_billings')
  @ApiOperation({ summary: 'Create a period billing' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_period_billings')
  @ApiOperation({ summary: 'List period billings' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_period_billings')
  @ApiOperation({ summary: 'Get a period billing by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_period_billings')
  @ApiOperation({ summary: 'Update a period billing' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_period_billings')
  @ApiOperation({ summary: 'Delete a period billing' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Adjustment Billings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/adjustment-billings')
export class ProjectAdjustmentBillingsController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.ADJUSTMENT_BILLINGS);
  }

  @Post()
  @Permissions('create_projects_project_adjustment_billings')
  @ApiOperation({ summary: 'Create a adjustment billing' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_adjustment_billings')
  @ApiOperation({ summary: 'List adjustment billings' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_adjustment_billings')
  @ApiOperation({ summary: 'Get a adjustment billing by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_adjustment_billings')
  @ApiOperation({ summary: 'Update a adjustment billing' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_adjustment_billings')
  @ApiOperation({ summary: 'Delete a adjustment billing' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}

@ApiTags('Project Billing | Quotes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-billing/quotes')
export class ProjectQuotesController extends ProjectBillingResourceController {
  constructor(service: ProjectBillingRecordService) {
    super(service, ProjectBillingResource.QUOTES);
  }

  @Post()
  @Permissions('create_projects_project_quotes')
  @ApiOperation({ summary: 'Create a quote' })
  create(
    @Body() dto: CreateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_quotes')
  @ApiOperation({ summary: 'List quotes' })
  findAll(
    @Query() query: QueryProjectBillingRecordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_quotes')
  @ApiOperation({ summary: 'Get a quote by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_quotes')
  @ApiOperation({ summary: 'Update a quote' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectBillingRecordDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_quotes')
  @ApiOperation({ summary: 'Delete a quote' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }
}
