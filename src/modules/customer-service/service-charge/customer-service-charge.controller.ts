import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceChargeService } from './customer-service-charge.service';
import {
  UpsertServiceChargeRateDto,
  GenerateMonthlyChargesDto,
  CreateFlatServiceChargeDto,
  CollectChargePaymentDto,
  QueryFlatServiceChargeDto,
  CreateBuildingIncomeDto,
  UpdateBuildingIncomeDto,
  QueryBuildingIncomeDto,
  CreateBuildingExpenseDto,
  UpdateBuildingExpenseDto,
  QueryBuildingExpenseDto,
} from './dto';

@ApiTags('Customer Service - Building Management | Service Charge & Costing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerServiceTenantGuard)
@Controller('customer-service/service-charge')
export class CustomerServiceChargeController {
  constructor(
    private readonly serviceChargeService: CustomerServiceChargeService,
  ) {}

  // =========================================================================
  // 1. TARIFF RATE
  // =========================================================================

  @Get('rate')
  @ApiOperation({ summary: 'Get service charge tariff rate for project' })
  async getProjectRate(
    @CurrentUser() user: any,
    @Query('project_id') projectId: string,
  ) {
    return this.serviceChargeService.getProjectRate(user, projectId);
  }

  @Put('rate')
  @ApiOperation({ summary: 'Upsert service charge tariff rate for project' })
  async upsertProjectRate(
    @CurrentUser() user: any,
    @Body() dto: UpsertServiceChargeRateDto,
  ) {
    return this.serviceChargeService.upsertProjectRate(user, dto);
  }

  // =========================================================================
  // 2. FLAT SERVICE CHARGES
  // =========================================================================

  @Post('generate')
  @ApiOperation({ summary: 'Batch generate monthly service charge bills for project flats' })
  async generateMonthlyCharges(
    @CurrentUser() user: any,
    @Body() dto: GenerateMonthlyChargesDto,
  ) {
    return this.serviceChargeService.generateMonthlyCharges(user, dto);
  }

  @Post('charges')
  @ApiOperation({ summary: 'Create individual flat service charge bill' })
  async createFlatCharge(
    @CurrentUser() user: any,
    @Body() dto: CreateFlatServiceChargeDto,
  ) {
    return this.serviceChargeService.createFlatCharge(user, dto);
  }

  @Get('charges')
  @ApiOperation({ summary: 'List flat service charges with payment status filtering' })
  async listFlatCharges(
    @CurrentUser() user: any,
    @Query() query: QueryFlatServiceChargeDto,
  ) {
    return this.serviceChargeService.listFlatCharges(user, query);
  }

  @Patch('charges/:uuid/payment')
  @ApiOperation({ summary: 'Collect / record payment for flat service charge' })
  async collectChargePayment(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: CollectChargePaymentDto,
  ) {
    return this.serviceChargeService.collectChargePayment(user, uuid, dto);
  }

  // =========================================================================
  // 3. EXTRA BUILDING INCOMES
  // =========================================================================

  @Post('incomes')
  @ApiOperation({ summary: 'Add extra building income (hall, rooftop rent, pool, mosque, other)' })
  async createBuildingIncome(
    @CurrentUser() user: any,
    @Body() dto: CreateBuildingIncomeDto,
  ) {
    return this.serviceChargeService.createBuildingIncome(user, dto);
  }

  @Get('incomes')
  @ApiOperation({ summary: 'List extra building incomes with category filtering' })
  async listBuildingIncomes(
    @CurrentUser() user: any,
    @Query() query: QueryBuildingIncomeDto,
  ) {
    return this.serviceChargeService.listBuildingIncomes(user, query);
  }

  @Patch('incomes/:uuid')
  @ApiOperation({ summary: 'Update extra building income entry' })
  async updateBuildingIncome(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBuildingIncomeDto,
  ) {
    return this.serviceChargeService.updateBuildingIncome(user, uuid, dto);
  }

  @Delete('incomes/:uuid')
  @ApiOperation({ summary: 'Delete extra building income entry' })
  async deleteBuildingIncome(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.serviceChargeService.deleteBuildingIncome(user, uuid);
  }

  // =========================================================================
  // 4. BUILDING EXPENSES
  // =========================================================================

  @Post('expenses')
  @ApiOperation({ summary: 'Add building maintenance expense (security, lift, utilities, cleaning, etc.)' })
  async createBuildingExpense(
    @CurrentUser() user: any,
    @Body() dto: CreateBuildingExpenseDto,
  ) {
    return this.serviceChargeService.createBuildingExpense(user, dto);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'List building expenses with category and date filtering' })
  async listBuildingExpenses(
    @CurrentUser() user: any,
    @Query() query: QueryBuildingExpenseDto,
  ) {
    return this.serviceChargeService.listBuildingExpenses(user, query);
  }

  @Patch('expenses/:uuid')
  @ApiOperation({ summary: 'Update building expense entry' })
  async updateBuildingExpense(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBuildingExpenseDto,
  ) {
    return this.serviceChargeService.updateBuildingExpense(user, uuid, dto);
  }

  @Delete('expenses/:uuid')
  @ApiOperation({ summary: 'Delete building expense entry' })
  async deleteBuildingExpense(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.serviceChargeService.deleteBuildingExpense(user, uuid);
  }

  // =========================================================================
  // 5. MONTHLY FINANCIAL SUMMARY
  // =========================================================================

  @Get('summary')
  @ApiOperation({ summary: 'Monthly financial summary (charges + extra incomes vs expenses, net surplus/deficit, category breakdowns)' })
  async getMonthlySummary(
    @CurrentUser() user: any,
    @Query('project_id') projectId: string,
    @Query('month') month?: string,
  ) {
    return this.serviceChargeService.getMonthlySummary(user, projectId, month);
  }
}

