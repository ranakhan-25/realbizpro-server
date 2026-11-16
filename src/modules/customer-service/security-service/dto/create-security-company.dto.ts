import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { SecurityCompanyStatus } from 'src/database/models/customer-service/cs_security.types';

export class CreateSecurityCompanyDto {
  @ApiProperty({ description: 'Company name', example: 'Elite Force Security Ltd.' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Contact person name', example: 'Major (Retd.) Tariqul Islam' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  contact_person: string;

  @ApiProperty({ description: 'Contact phone number', example: '+8801711223344' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phone: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'info@eliteforce.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiProperty({ description: 'Contract start date (YYYY-MM-DD)', example: '2026-01-01' })
  @IsNotEmpty()
  @IsDateString()
  contract_start: string;

  @ApiProperty({ description: 'Contract end date (YYYY-MM-DD)', example: '2026-12-31' })
  @IsNotEmpty()
  @IsDateString()
  contract_end: string;

  @ApiProperty({ description: 'Monthly contracted security cost in BDT', example: 120000 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthly_cost: number;

  @ApiProperty({
    description: 'Liability note: terms covering replacement guards and liability if a guard quits or negligence occurs',
    example: 'Company guarantees replacement within 4 hours and bears full liability for guard negligence.',
  })
  @IsNotEmpty()
  @IsString()
  liability_note: string;

  @ApiPropertyOptional({
    description: 'Contract status',
    enum: ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'TERMINATED'],
    default: 'ACTIVE',
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'TERMINATED'])
  status?: SecurityCompanyStatus;

  @ApiPropertyOptional({ description: 'Specific project UUID if company is project-scoped' })
  @IsOptional()
  @IsUUID('4')
  project_id?: string;
}
