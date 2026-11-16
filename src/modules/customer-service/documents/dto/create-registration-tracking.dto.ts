import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRegistrationTrackingDto {
  @ApiProperty({
    description: 'Customer full name',
    example: 'Mohammad Rafiqul Islam',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customer_name: string;

  @ApiPropertyOptional({
    description: 'Unit designation',
    example: 'A-7, Hena Heights',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  unit_name?: string;

  @ApiPropertyOptional({
    description: 'Project name',
    example: 'Hena Heights, Gulshan',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  project_name?: string;

  @ApiPropertyOptional({
    description: 'Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Booking UUID',
  })
  @IsOptional()
  @IsString()
  booking_id?: string;

  @ApiPropertyOptional({
    description: 'Customer Profile ID',
  })
  @IsOptional()
  customer_profile_id?: number;

  @ApiProperty({
    description: 'Sub-Registrar office name and location',
    example: 'Sub-Registrar Office, Gulshan (Dhaka)',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  sub_registrar_office: string;

  @ApiPropertyOptional({
    description: 'Deed drafting status (Draft Ready, Vetting Complete, Revision Requested)',
    default: 'Draft Ready',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  deed_draft_status?: string;

  @ApiPropertyOptional({
    description: 'Scheduled date of registration appointment (YYYY-MM-DD)',
    example: '2026-11-18',
  })
  @IsOptional()
  @IsString()
  registration_date_scheduled?: string;

  @ApiPropertyOptional({
    description: 'Total government registration fees in BDT',
    example: 850000,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  total_govt_fees?: number;

  @ApiPropertyOptional({
    description: 'Whether fee receipt has been collected/deposited',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  fee_receipt_collected?: boolean;

  @ApiPropertyOptional({
    description: 'Official Registered Deed Number (if completed)',
    example: 'DEED-2026-99120',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  registered_deed_no?: string;

  @ApiPropertyOptional({
    description: 'Workflow status (Documents Gathering, Drafting & Vetting, Appointment Booked, Registry Executed, Original Deed Delivered)',
    default: 'Documents Gathering',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional({
    description: 'Date original deed delivered to purchaser (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  delivered_date?: string;

  @ApiPropertyOptional({
    description: 'General remarks or coordination notes',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
