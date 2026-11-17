/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOverviewDto {
  @ApiProperty({ example: 'Sunrise Tower' })
  @IsString()
  propertyName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyArea?: string;

  @ApiProperty({ example: 5000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  propertyPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyImage?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  buyerName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  buyerEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyerAvatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyerNid?: string;

  @ApiProperty({ example: 5000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({ example: 500000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amountPaid: number;

  @ApiProperty({ example: 4500000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  remainingDue: number;

  @ApiPropertyOptional({ example: '2026-12-01' })
  @IsOptional()
  @IsString()
  nextDueDate?: string;
}