/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCancellationDto {
  // ✅ bookingId ফিল্ডটি এখানে যোগ করা হলো, যাতে whitelistValidation এরর না দেয়
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cancellationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cancellationDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refundDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  refundAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  penaltyFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  cancellationFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPaid?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAcknowledged?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  processedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyerName?: string;
}