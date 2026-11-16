import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  ExternalRentalStatus,
  ParkingSlotStatus,
  ParkingVehicleType,
  RentalPaymentStatus,
} from 'src/database/models/customer-service/cs_parking.types';

// =========================================================================
// 1. SLOTS DTOs
// =========================================================================

export class CreateParkingSlotDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ description: 'Slot identifier, unique within project (e.g. B1-01)' })
  @IsString()
  slot_number: string;

  @ApiPropertyOptional({ description: 'Floor / Zone (e.g. Basement 1, Ground Floor)', default: 'Ground Floor' })
  @IsOptional()
  @IsString()
  floor_zone?: string;

  @ApiPropertyOptional({
    description: 'Allowed vehicle type',
    enum: ['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'],
    default: 'Car',
  })
  @IsOptional()
  @IsIn(['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'])
  allowed_vehicle_type?: ParkingVehicleType;

  @ApiPropertyOptional({
    description: 'Initial slot status',
    enum: ['FREE', 'OCCUPIED', 'RENTED_EXTERNAL'],
    default: 'FREE',
  })
  @IsOptional()
  @IsIn(['FREE', 'OCCUPIED', 'RENTED_EXTERNAL'])
  status?: ParkingSlotStatus;

  @ApiPropertyOptional({ description: 'Slot notes or specific dimensions' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateParkingSlotDto {
  @ApiPropertyOptional({ description: 'Slot identifier (e.g. B1-01)' })
  @IsOptional()
  @IsString()
  slot_number?: string;

  @ApiPropertyOptional({ description: 'Floor / Zone' })
  @IsOptional()
  @IsString()
  floor_zone?: string;

  @ApiPropertyOptional({
    description: 'Allowed vehicle type',
    enum: ['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'],
  })
  @IsOptional()
  @IsIn(['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'])
  allowed_vehicle_type?: ParkingVehicleType;

  @ApiPropertyOptional({
    description: 'Slot status',
    enum: ['FREE', 'OCCUPIED', 'RENTED_EXTERNAL'],
  })
  @IsOptional()
  @IsIn(['FREE', 'OCCUPIED', 'RENTED_EXTERNAL'])
  status?: ParkingSlotStatus;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryParkingSlotDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ description: 'Filter by floor/zone' })
  @IsOptional()
  @IsString()
  floor_zone?: string;

  @ApiPropertyOptional({ description: 'Filter by status (FREE, OCCUPIED, RENTED_EXTERNAL, all)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by allowed vehicle type' })
  @IsOptional()
  @IsString()
  allowed_vehicle_type?: string;

  @ApiPropertyOptional({ description: 'Search term for slot number or notes' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

// =========================================================================
// 2. ASSIGNMENTS DTOs
// =========================================================================

export class CreateParkingAssignmentDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ description: 'Parking slot ID' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  slot_id: number;

  @ApiProperty({ description: 'Flat or unit number (e.g. Flat 7A)' })
  @IsString()
  flat_number: string;

  @ApiProperty({ description: 'Resident / Flat owner name' })
  @IsString()
  resident_name: string;

  @ApiPropertyOptional({ description: 'Resident phone number' })
  @IsOptional()
  @IsString()
  resident_phone?: string;

  @ApiProperty({ description: 'Vehicle registration plate number' })
  @IsString()
  vehicle_number: string;

  @ApiPropertyOptional({
    description: 'Vehicle type',
    enum: ['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'],
    default: 'Car',
  })
  @IsOptional()
  @IsIn(['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'])
  vehicle_type?: ParkingVehicleType;

  @ApiPropertyOptional({ description: 'RFID barrier gate tag number' })
  @IsOptional()
  @IsString()
  rfid_tag?: string;

  @ApiProperty({ description: 'Assignment start date (YYYY-MM-DD)' })
  @IsString()
  start_date: string;

  @ApiPropertyOptional({ description: 'Assignment end date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  end_date?: string;
}

export class ReleaseParkingAssignmentDto {
  @ApiPropertyOptional({ description: 'Release date (defaults to current date)' })
  @IsOptional()
  @IsString()
  release_date?: string;

  @ApiPropertyOptional({ description: 'Reason for releasing slot (e.g. Flat sold, vehicle changed)' })
  @IsOptional()
  @IsString()
  release_reason?: string;
}

export class QueryParkingAssignmentDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ description: 'Filter by slot ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  slot_id?: number;

  @ApiPropertyOptional({ description: 'Filter by active status (true/false/all)' })
  @IsOptional()
  @IsString()
  is_active?: string;

  @ApiPropertyOptional({ description: 'Search term for resident, flat, vehicle, rfid' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

// =========================================================================
// 3. EXTERNAL RENTALS DTOs
// =========================================================================

export class CreateExternalRentalDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ description: 'Parking slot ID' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  slot_id: number;

  @ApiProperty({ description: 'External renter full name' })
  @IsString()
  renter_name: string;

  @ApiProperty({ description: 'Renter phone number' })
  @IsString()
  renter_phone: string;

  @ApiPropertyOptional({ description: 'Renter National ID or Passport' })
  @IsOptional()
  @IsString()
  renter_nid?: string;

  @ApiProperty({ description: 'Vehicle registration plate number' })
  @IsString()
  vehicle_number: string;

  @ApiPropertyOptional({
    description: 'Vehicle type',
    enum: ['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'],
    default: 'Car',
  })
  @IsOptional()
  @IsIn(['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'])
  vehicle_type?: ParkingVehicleType;

  @ApiProperty({ description: 'Monthly rent amount (BDT)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthly_rent: number;

  @ApiPropertyOptional({ description: 'Security deposit amount (BDT)', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deposit_amount?: number;

  @ApiProperty({ description: 'Rental start date (YYYY-MM-DD)' })
  @IsString()
  start_date: string;

  @ApiPropertyOptional({ description: 'Rental end date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Notes or agreement terms' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CollectRentalPaymentDto {
  @ApiProperty({ description: 'Amount collected (BDT)' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ description: 'Payment date (YYYY-MM-DD, defaults to today)' })
  @IsOptional()
  @IsString()
  payment_date?: string;

  @ApiPropertyOptional({ description: 'Payment reference or money receipt number' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ description: 'Payment notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class TerminateExternalRentalDto {
  @ApiPropertyOptional({ description: 'Termination date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Reason for terminating rental' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryExternalRentalDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ description: 'Filter by slot ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  slot_id?: number;

  @ApiPropertyOptional({ description: 'Filter by payment status (PAID, PARTIAL, DUE, OVERDUE, all)' })
  @IsOptional()
  @IsString()
  payment_status?: string;

  @ApiPropertyOptional({ description: 'Filter by rental status (ACTIVE, TERMINATED, EXPIRED, all)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Search term for renter, phone, vehicle' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

