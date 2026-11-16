import {
  IsDecimal,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  BuildingExpenseType,
  BuildingIncomeType,
  RateBasis,
  ServiceChargePaymentStatus,
} from 'src/database/models/customer-service/cs_service_charge.types';

// =========================================================================
// 1. SERVICE CHARGE RATE DTOs
// =========================================================================

export class UpsertServiceChargeRateDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({
    description: 'Calculation basis for monthly charges',
    enum: ['PER_SQFT', 'FIXED_PER_FLAT'],
    default: 'PER_SQFT',
  })
  @IsIn(['PER_SQFT', 'FIXED_PER_FLAT'])
  rate_basis: RateBasis;

  @ApiPropertyOptional({
    description: 'Rate per square foot if PER_SQFT (e.g. 5.00 ৳/sqft)',
    default: 5.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rate_per_sqft?: number;

  @ApiPropertyOptional({
    description: 'Fixed flat charge if FIXED_PER_FLAT (e.g. 5000.00 ৳)',
    default: 5000.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fixed_rate_per_flat?: number;

  @ApiPropertyOptional({
    description: 'Day of month charges are due (1-28)',
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  due_day_of_month?: number;

  @ApiPropertyOptional({ description: 'Notes or remarks on tariff policy' })
  @IsOptional()
  @IsString()
  notes?: string;
}

// =========================================================================
// 2. FLAT SERVICE CHARGES DTOs
// =========================================================================

export class FlatBillingItemDto {
  @ApiProperty({ description: 'Flat identifier (e.g. A-4, 5B)' })
  @IsString()
  flat_number: string;

  @ApiProperty({ description: 'Resident / Owner name' })
  @IsString()
  resident_name: string;

  @ApiPropertyOptional({ description: 'Resident phone number' })
  @IsOptional()
  @IsString()
  resident_phone?: string;

  @ApiPropertyOptional({ description: 'Flat size in square feet', default: 1500.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  flat_size_sqft?: number;
}

export class GenerateMonthlyChargesDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ description: 'Billing month in YYYY-MM format', example: '2026-11' })
  @IsString()
  billing_month: string;

  @ApiPropertyOptional({ description: 'Custom due date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  due_date?: string;

  @ApiPropertyOptional({
    description: 'Optional list of flats to bill. If omitted, bills are auto-generated from project units/bookings',
    type: [FlatBillingItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlatBillingItemDto)
  flats?: FlatBillingItemDto[];
}

export class CreateFlatServiceChargeDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ description: 'Flat identifier (e.g. 5B)' })
  @IsString()
  flat_number: string;

  @ApiProperty({ description: 'Resident / Owner name' })
  @IsString()
  resident_name: string;

  @ApiPropertyOptional({ description: 'Resident phone number' })
  @IsOptional()
  @IsString()
  resident_phone?: string;

  @ApiPropertyOptional({ description: 'Flat size in square feet', default: 1500.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  flat_size_sqft?: number;

  @ApiProperty({ description: 'Billing month YYYY-MM', example: '2026-11' })
  @IsString()
  billing_month: string;

  @ApiPropertyOptional({ description: 'Explicit total amount (auto-calculated if omitted)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount?: number;

  @ApiPropertyOptional({ description: 'Due date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  due_date?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CollectChargePaymentDto {
  @ApiProperty({ description: 'Amount collected / paid in this transaction', example: 5000 })
  @IsNumber()
  @IsPositive()
  paid_amount: number;

  @ApiPropertyOptional({ description: 'Payment date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  payment_date?: string;

  @ApiPropertyOptional({
    description: 'Payment method',
    enum: ['Cash', 'Bank Transfer', 'bKash / Nagad', 'Cheque', 'Other'],
    default: 'Bank Transfer',
  })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiPropertyOptional({ description: 'Transaction / Cheque / Slip reference number' })
  @IsOptional()
  @IsString()
  reference_number?: string;

  @ApiPropertyOptional({ description: 'Payment notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryFlatServiceChargeDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({ description: 'Filter by billing month (YYYY-MM)' })
  @IsOptional()
  @IsString()
  billing_month?: string;

  @ApiPropertyOptional({
    description: 'Filter by payment status',
    enum: ['PAID', 'PARTIAL', 'DUE', 'OVERDUE', 'all'],
  })
  @IsOptional()
  @IsString()
  payment_status?: string;

  @ApiPropertyOptional({ description: 'Search resident or flat number' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;
}

// =========================================================================
// 3. EXTRA BUILDING INCOMES DTOs
// =========================================================================

export class CreateBuildingIncomeDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({
    description: 'Income category',
    enum: ['COMMUNITY_HALL', 'ROOFTOP_RENT', 'PARKING', 'SWIMMING_POOL', 'MOSQUE', 'OTHER'],
  })
  @IsIn(['COMMUNITY_HALL', 'ROOFTOP_RENT', 'PARKING', 'SWIMMING_POOL', 'MOSQUE', 'OTHER'])
  income_type: BuildingIncomeType;

  @ApiProperty({ description: 'Income title / event / renter name', example: 'Community Hall Booking - Wedding Reception' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Income amount in ৳', example: 15000.0 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Income date YYYY-MM-DD' })
  @IsString()
  income_date: string;

  @ApiPropertyOptional({ description: 'Received from (resident or outsider name)' })
  @IsOptional()
  @IsString()
  received_from?: string;

  @ApiPropertyOptional({ description: 'Receipt / Booking slip reference' })
  @IsOptional()
  @IsString()
  source_reference?: string;

  @ApiPropertyOptional({ description: 'Notes or details' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBuildingIncomeDto {
  @ApiPropertyOptional({
    description: 'Income category',
    enum: ['COMMUNITY_HALL', 'ROOFTOP_RENT', 'PARKING', 'SWIMMING_POOL', 'MOSQUE', 'OTHER'],
  })
  @IsOptional()
  @IsIn(['COMMUNITY_HALL', 'ROOFTOP_RENT', 'PARKING', 'SWIMMING_POOL', 'MOSQUE', 'OTHER'])
  income_type?: BuildingIncomeType;

  @ApiPropertyOptional({ description: 'Income title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Amount in ৳' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiPropertyOptional({ description: 'Income date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  income_date?: string;

  @ApiPropertyOptional({ description: 'Received from' })
  @IsOptional()
  @IsString()
  received_from?: string;

  @ApiPropertyOptional({ description: 'Source reference' })
  @IsOptional()
  @IsString()
  source_reference?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryBuildingIncomeDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by income category',
    enum: ['COMMUNITY_HALL', 'ROOFTOP_RENT', 'PARKING', 'SWIMMING_POOL', 'MOSQUE', 'OTHER', 'all'],
  })
  @IsOptional()
  @IsString()
  income_type?: string;

  @ApiPropertyOptional({ description: 'Filter by month YYYY-MM' })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({ description: 'Start date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'End date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Search title, payer or notes' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;
}

// =========================================================================
// 4. BUILDING EXPENSES DTOs
// =========================================================================

export class CreateBuildingExpenseDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({
    description: 'Expense category',
    enum: ['SECURITY', 'LIFT', 'UTILITIES', 'CLEANING', 'MAINTENANCE', 'OTHER'],
  })
  @IsIn(['SECURITY', 'LIFT', 'UTILITIES', 'CLEANING', 'MAINTENANCE', 'OTHER'])
  expense_type: BuildingExpenseType;

  @ApiProperty({ description: 'Expense title / line item', example: 'Otis Lift Monthly AMC & Lubrication' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Vendor / Contractor / Service provider name' })
  @IsOptional()
  @IsString()
  vendor_name?: string;

  @ApiProperty({ description: 'Expense amount in ৳', example: 12000.0 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Expense date YYYY-MM-DD' })
  @IsString()
  expense_date: string;

  @ApiPropertyOptional({ description: 'Invoice / Bill voucher number' })
  @IsOptional()
  @IsString()
  invoice_reference?: string;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: ['PAID', 'PENDING'],
    default: 'PAID',
  })
  @IsOptional()
  @IsIn(['PAID', 'PENDING'])
  payment_status?: 'PAID' | 'PENDING';

  @ApiPropertyOptional({ description: 'Expense notes or breakdown' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBuildingExpenseDto {
  @ApiPropertyOptional({
    description: 'Expense category',
    enum: ['SECURITY', 'LIFT', 'UTILITIES', 'CLEANING', 'MAINTENANCE', 'OTHER'],
  })
  @IsOptional()
  @IsIn(['SECURITY', 'LIFT', 'UTILITIES', 'CLEANING', 'MAINTENANCE', 'OTHER'])
  expense_type?: BuildingExpenseType;

  @ApiPropertyOptional({ description: 'Expense title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Vendor name' })
  @IsOptional()
  @IsString()
  vendor_name?: string;

  @ApiPropertyOptional({ description: 'Expense amount in ৳' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiPropertyOptional({ description: 'Expense date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  expense_date?: string;

  @ApiPropertyOptional({ description: 'Invoice reference' })
  @IsOptional()
  @IsString()
  invoice_reference?: string;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: ['PAID', 'PENDING'],
  })
  @IsOptional()
  @IsIn(['PAID', 'PENDING'])
  payment_status?: 'PAID' | 'PENDING';

  @ApiPropertyOptional({ description: 'Expense notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryBuildingExpenseDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by expense category',
    enum: ['SECURITY', 'LIFT', 'UTILITIES', 'CLEANING', 'MAINTENANCE', 'OTHER', 'all'],
  })
  @IsOptional()
  @IsString()
  expense_type?: string;

  @ApiPropertyOptional({ description: 'Filter by month YYYY-MM' })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({ description: 'Start date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'End date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: ['PAID', 'PENDING', 'all'],
  })
  @IsOptional()
  @IsString()
  payment_status?: string;

  @ApiPropertyOptional({ description: 'Search title, vendor or notes' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;
}

