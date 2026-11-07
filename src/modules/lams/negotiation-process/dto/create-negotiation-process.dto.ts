import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNegotiationProcessDto {
  @ApiProperty({ description: 'UUID of the associated acquisition lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @ApiPropertyOptional({ description: 'Date of negotiation', example: '2026-10-07' })
  @IsDateString()
  @IsOptional()
  negotiation_date?: string;

  @ApiPropertyOptional({ description: 'Price offered', example: 1500000 })
  @IsNumber()
  @IsOptional()
  offered_price?: number;

  @ApiPropertyOptional({ description: 'Price agreed upon', example: 1600000 })
  @IsNumber()
  @IsOptional()
  agreed_price?: number;

  @ApiPropertyOptional({ description: 'Current status of negotiation', example: 'In Progress' })
  @IsString()
  @IsOptional()
  negotiation_status?: string;

  @ApiPropertyOptional({ description: 'Date for the next meeting', example: '2026-10-15' })
  @IsDateString()
  @IsOptional()
  next_meeting_date?: string;

  @ApiPropertyOptional({ description: 'Notes from the meeting', example: 'Discussed pricing and terms.' })
  @IsString()
  @IsOptional()
  meeting_notes?: string;

  @ApiPropertyOptional({ description: 'Optional project identifier', example: 'PRJ-1001' })
  @IsString()
  @IsOptional()
  org_id?: string;
}
