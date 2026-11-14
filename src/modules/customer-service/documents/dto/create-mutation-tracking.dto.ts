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

export class CreateMutationTrackingDto {
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
    description: 'Bangladesh Land Ministry e-Mutation Application No',
    example: 'MUT-2026-DH-88419',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  mutation_app_no: string;

  @ApiProperty({
    description: 'Assistant Commissioner (Land) Office name',
    example: 'AC (Land) Office, Gulshan Circle, Dhaka',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  ac_land_office: string;

  @ApiPropertyOptional({
    description: 'Current Land Office Stage (Application Submitted, Kanungo/Surveyor Inquiry, Hearing Scheduled, DCR Payment Pending, Khatian Approved, Rejected)',
    default: 'Kanungo/Surveyor Inquiry',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  current_stage?: string;

  @ApiPropertyOptional({
    description: 'Hearing Date (YYYY-MM-DD)',
    example: '2026-11-22',
  })
  @IsOptional()
  @IsString()
  hearing_date?: string;

  @ApiPropertyOptional({
    description: 'DCR Number (Duplicate Carbon Receipt)',
    example: 'DCR-2026-77881',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  dcr_number?: string;

  @ApiPropertyOptional({
    description: 'DCR Fee Amount in BDT (standard ৳ 1170)',
    default: 1170.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dcr_fee_amount?: number;

  @ApiPropertyOptional({
    description: 'Whether DCR Fee has been paid to Land Ministry',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  dcr_paid?: boolean;

  @ApiPropertyOptional({
    description: 'Official Approved Khatian Number',
    example: 'Khatian No. 12904 (Namjari)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  khatian_number?: string;

  @ApiPropertyOptional({
    description: 'Notes or remarks',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
