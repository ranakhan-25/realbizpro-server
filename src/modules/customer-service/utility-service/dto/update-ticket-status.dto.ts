import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TicketStatusEnum {
  OPEN = 'Open',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  HANDED_OVER = 'Handed Over',
  CLOSED = 'Closed',
}

export class UpdateTicketStatusDto {
  @ApiProperty({
    description: 'Target workflow status',
    enum: TicketStatusEnum,
    example: TicketStatusEnum.RESOLVED,
  })
  @IsNotEmpty()
  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;

  @ApiPropertyOptional({ description: 'Technician resolution notes' })
  @IsOptional()
  @IsString()
  resolution_notes?: string;

  @ApiPropertyOptional({ description: 'Actual charge collected if PAID service' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actual_charge?: number;

  @ApiPropertyOptional({ description: 'Flat owner feedback remarks' })
  @IsOptional()
  @IsString()
  customer_feedback?: string;

  @ApiPropertyOptional({ description: 'Owner satisfaction rating (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  customer_rating?: number;
}

