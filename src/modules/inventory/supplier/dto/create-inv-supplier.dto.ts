import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateInvSupplierDto {
  @ApiProperty({ description: 'The unique code for the supplier', example: 'SUP-001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'The display name of the supplier', example: 'ABC Corp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Company name', example: 'ABC Holdings' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'contact@abccorp.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Mobile phone number', example: '+8801700000000' })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiPropertyOptional({ description: 'Physical address', example: 'Dhaka, Bangladesh' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Maximum credit limit', example: 500000 })
  @IsNumber()
  @IsNotEmpty()
  credit_limit: number;

  @ApiPropertyOptional({ description: 'Due date for payments', example: '2026-12-31' })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiProperty({ description: 'Opening financial balance', example: 0 })
  @IsNumber()
  @IsNotEmpty()
  opening_balance: number;

  @ApiPropertyOptional({ description: 'Chart of Group ID', example: 301 })
  @IsNumber()
  @IsOptional()
  chart_of_group_id?: number;

  @ApiPropertyOptional({ example: 'uuid', description: 'Created By ID' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Updated By ID' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Deleted By ID' })
  @IsOptional()
  @IsString()
  deletedBy?: string;

  @ApiPropertyOptional({ example: 'PRJ-1001', description: 'Optional Project Identifier' })
  @IsOptional()
  @IsString()
  projectId?: string;
}
