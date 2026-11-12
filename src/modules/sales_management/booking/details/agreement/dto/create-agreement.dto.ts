/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAgreementDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agreementCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyerAvatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyerEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  property?: string;

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
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  advance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ type: String, format: 'date' })
  @IsOptional()
  @IsString()
  agreementDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  // ✅ notes ফিল্ডটি যোগ করা হলো
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}