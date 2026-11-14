import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { GuardSource, GuardStatus } from 'src/database/models/customer-service/cs_security.types';

export class CreateSecurityGuardDto {
  @ApiProperty({ description: 'Guard full name', example: 'Md. Jahangir Alam' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ description: 'Contact phone number', example: '+8801711238491' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phone: string;

  @ApiProperty({ description: 'National ID number (NID)', example: '19872691234567890' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  national_id: string;

  @ApiProperty({
    description: 'Guard deployment source',
    enum: ['IN_HOUSE', 'COMPANY'],
    example: 'COMPANY',
  })
  @IsNotEmpty()
  @IsIn(['IN_HOUSE', 'COMPANY'])
  source: GuardSource;

  @ApiPropertyOptional({
    description: 'Security company ID (Mandatory when source is COMPANY)',
    example: 1,
  })
  @ValidateIf((o) => o.source === 'COMPANY')
  @IsNotEmpty({ message: 'company_id is required when guard source is COMPANY' })
  @Type(() => Number)
  @IsInt()
  company_id?: number;

  @ApiPropertyOptional({ description: 'Assigned project UUID' })
  @IsOptional()
  @IsUUID('4')
  project_id?: string;

  @ApiPropertyOptional({ description: 'Badge / Uniform number', example: 'G-104' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  badge_number?: string;

  @ApiPropertyOptional({
    description: 'Guard active status',
    enum: ['ACTIVE', 'ON_LEAVE', 'INACTIVE', 'TERMINATED'],
    default: 'ACTIVE',
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'ON_LEAVE', 'INACTIVE', 'TERMINATED'])
  status?: GuardStatus;

  @ApiProperty({ description: 'Date joined service (YYYY-MM-DD)', example: '2026-02-01' })
  @IsNotEmpty()
  @IsDateString()
  joined_date: string;

  @ApiPropertyOptional({ description: 'Emergency contact person and phone', example: 'Brother - 01811223344' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  emergency_contact?: string;
}
