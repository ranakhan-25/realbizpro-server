import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Registered Baina Deed Copy',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  doc_title: string;

  @ApiPropertyOptional({
    description: 'Document category',
    example: 'Sale Agreement (Baina)',
    default: 'Sale Agreement (Baina)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  doc_category?: string;

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
    description: 'Project UUID',
    example: 'f87a8b41-396a-4950-8b42-1e967a57fa78',
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

  @ApiPropertyOptional({
    description: 'File name',
    example: 'baina_deed_rafiqul_islam.pdf',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_name?: string;

  @ApiPropertyOptional({
    description: 'File size',
    example: '4.8 MB',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  file_size?: string;

  @ApiPropertyOptional({
    description: 'S3/MinIO file key or public URL',
  })
  @IsOptional()
  @IsString()
  file_url?: string;

  @ApiPropertyOptional({
    description: 'S3/MinIO file storage key',
  })
  @IsOptional()
  @IsString()
  file_key?: string;

  @ApiPropertyOptional({
    description: 'Upload date (YYYY-MM-DD)',
    example: '2026-10-12',
  })
  @IsOptional()
  @IsString()
  upload_date?: string;

  @ApiPropertyOptional({
    description: 'Verification / vetting status',
    example: 'Pending Vetting',
    default: 'Pending Vetting',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  verification_status?: string;

  @ApiPropertyOptional({
    description: 'Internal notes or vetting comments',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
