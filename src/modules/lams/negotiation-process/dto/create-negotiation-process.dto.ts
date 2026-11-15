import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNegotiationProcessDto {
  @ApiProperty({ description: 'Mandatory tenant organization identifier', example: 'org-001' })
  @IsString()
  @IsNotEmpty()
  org_id: string;

  @ApiProperty({ description: 'UUID of the associated acquisition lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @ApiPropertyOptional({ description: 'Round number of negotiation meeting', example: 1 })
  @IsNumber()
  @IsOptional()
  round_no?: number;

  @ApiPropertyOptional({ description: 'Date of negotiation meeting', example: '2026-10-07' })
  @IsDateString()
  @IsOptional()
  negotiation_date?: string;

  @ApiPropertyOptional({ description: 'Company offered price in BDT', example: 45000000 })
  @IsNumber()
  @IsOptional()
  offered_price?: number;

  @ApiPropertyOptional({ description: 'Landowner counter offer price in BDT', example: 52000000 })
  @IsNumber()
  @IsOptional()
  counter_amount?: number;

  @ApiPropertyOptional({ description: 'Variance or price gap between offers', example: 7000000 })
  @IsNumber()
  @IsOptional()
  gap_amount?: number;

  @ApiPropertyOptional({ description: 'Price agreed upon in BDT', example: 48000000 })
  @IsNumber()
  @IsOptional()
  agreed_price?: number;

  @ApiPropertyOptional({ description: 'Final settled amount in BDT', example: 48000000 })
  @IsNumber()
  @IsOptional()
  final_amount?: number;

  @ApiPropertyOptional({ description: 'Officer or negotiator leading the meeting', example: 'Tanvir Hossain' })
  @IsString()
  @IsOptional()
  negotiator?: string;

  @ApiPropertyOptional({ description: 'Current status of negotiation', example: 'Pending' })
  @IsString()
  @IsOptional()
  negotiation_status?: string;

  @ApiPropertyOptional({ description: 'Date for the next meeting', example: '2026-10-15' })
  @IsDateString()
  @IsOptional()
  next_meeting_date?: string;

  @ApiPropertyOptional({ description: 'Notes and minutes from the meeting', example: 'Owner agreed to reduce gap by 20 Lac.' })
  @IsString()
  @IsOptional()
  meeting_notes?: string;
}
