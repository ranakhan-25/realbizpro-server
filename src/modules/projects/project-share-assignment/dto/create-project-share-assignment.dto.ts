/* eslint-disable prettier/prettier */
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProjectShareAssignmentDto {
  // ─────────────── Relations ───────────────
  @ApiProperty({
    format: 'uuid',
    description: 'Project UUID',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'ProjectType UUID',
  })
  @IsOptional()
  @IsUUID()
  projectTypeId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Site UUID',
  })
  @IsOptional()
  @IsUUID()
  siteId?: string;

  // ─────────────── Share Code (optional → auto generate) ───────────────
  @ApiPropertyOptional({
    example: 'SHR-516471',
    description:
      'Leave empty to auto-generate (SHR-XXXXXX)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  shareCode?: string;

  // ─────────────── Customer Info ───────────────
  @ApiProperty({ example: 'Tanvir Ahmed' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  customerName: string;

  @ApiProperty({
    example: 50,
    description: 'Number of shares',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  noOfShares: number;

  @ApiPropertyOptional({ example: 'A-101' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  flatLand?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  // ─────────────── Financial ───────────────
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  shareAmount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  paidAmount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCost?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  balance?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  due?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  penaltyAmount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  points?: number;

  // ─────────────── Other ───────────────
  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  assignedAt?: string;

  @ApiPropertyOptional({
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'pending'])
  status?: 'active' | 'inactive' | 'pending';
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
