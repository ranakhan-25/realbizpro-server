import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';

export class CreateCrmNegotiationDto {
  @ApiProperty({ example: 1, description: 'Lead ID' })
  @IsNumber()
  @IsNotEmpty()
  lead_id: number;

  @ApiPropertyOptional({ example: 'PLOT-402' })
  @IsString()
  @IsOptional()
  property_id?: string;

  @ApiProperty({ example: 7500000, description: 'Initial offer price' })
  @IsNumber()
  @IsNotEmpty()
  offer_price: number;

  @ApiPropertyOptional({ example: 7200000, description: 'Client agreed price' })
  @IsNumber()
  @IsOptional()
  agreed_price?: number;

  @ApiPropertyOptional({ example: 300000, description: 'Discount given' })
  @IsNumber()
  @IsOptional()
  discount_amount?: number;

  @ApiPropertyOptional({ example: 'Special terms: 40% upfront, remaining in 24 months' })
  @IsString()
  @IsOptional()
  special_terms?: string;

  @ApiPropertyOptional({ example: 'pending', enum: ['pending', 'approved', 'rejected'] })
  @IsString()
  @IsOptional()
  approval_status?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmNegotiationDto extends PartialType(CreateCrmNegotiationDto) {}

export class ApproveCrmNegotiationDto {
  @ApiProperty({ example: 'approved', enum: ['approved', 'rejected'] })
  @IsString()
  @IsIn(['approved', 'rejected'])
  approval_status: string;

  @ApiProperty({ example: 'USR-DIRECTOR' })
  @IsString()
  @IsNotEmpty()
  approved_by: string;

  @ApiPropertyOptional({ example: 'Approved with management concession' })
  @IsString()
  @IsOptional()
  rejection_reason?: string;
}
