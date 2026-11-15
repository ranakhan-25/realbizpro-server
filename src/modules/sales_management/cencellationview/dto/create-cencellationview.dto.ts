import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  CancellationReason,
  CancellationStatus,
} from '../../../../database/models/sales_management/sm_cencellationview.model';

export class CreateCancellationDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID of the booking being cancelled',
  })
  @IsUUID('4')
  bookingId: string;

  @ApiProperty({
    enum: CancellationReason,
    example: CancellationReason.BUYER_CHANGED_MIND,
  })
  @IsEnum(CancellationReason)
  reason: CancellationReason;

  @ApiProperty({
    example: '2024-01-25',
    description: 'YYYY-MM-DD date of cancellation',
  })
  @IsString()
  @IsNotEmpty()
  cancellationDate: string;

  @ApiProperty({
    example: 4482000,
    description: 'Amount refunded to buyer (must be <= paid - penalty)',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  refundAmount: number;

  @ApiProperty({
    example: 498000,
    description: 'Penalty deducted from the paid amount',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  penaltyFee: number;

  @ApiPropertyOptional({
    example: 'Buyer requested cancellation due to relocation.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiProperty({
    example: true,
    description: 'User must acknowledge the financial impact (UI checkbox)',
  })
  @IsBoolean()
  isAcknowledged: boolean;

  @ApiPropertyOptional({
    enum: CancellationStatus,
    default: CancellationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(CancellationStatus)
  status?: CancellationStatus;

  @ApiPropertyOptional({ example: 'Admin - Rakib' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  processedBy?: string;
}
