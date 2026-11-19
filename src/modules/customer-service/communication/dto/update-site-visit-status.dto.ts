import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { VisitStatus } from 'src/database/models/customer-service/cs_communication.types';

export class UpdateSiteVisitStatusDto {
  @ApiPropertyOptional({ enum: VisitStatus })
  @IsOptional()
  status?: VisitStatus;

  @ApiPropertyOptional({ description: 'Rescheduled date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  appointment_date?: string;

  @ApiPropertyOptional({ description: 'Rescheduled time slot' })
  @IsOptional()
  @IsString()
  time_slot?: string;

  @ApiPropertyOptional({ description: 'Escort User ID' })
  @IsOptional()
  assigned_escort_id?: number;

  @ApiPropertyOptional({ description: 'Assigned Escort name' })
  @IsOptional()
  @IsString()
  assigned_escort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  safety_ppe_required?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer_notes?: string;

  @ApiPropertyOptional({ description: 'Inspection or walkthrough findings' })
  @IsOptional()
  @IsString()
  inspection_findings?: string;

  @ApiPropertyOptional({ description: 'Outcome or walkthrough notes' })
  @IsOptional()
  @IsString()
  outcome_notes?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  outcomeNotes?: string;

  @ApiPropertyOptional({ description: 'Walkthrough checklist array' })
  @IsOptional()
  checklist?: Array<{ item: string; checked: boolean; remarks?: string }>;
}
