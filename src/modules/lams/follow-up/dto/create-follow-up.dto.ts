import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFollowUpDto {
  @ApiProperty({ description: 'UUID of the associated acquisition lead' })
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @ApiPropertyOptional({ description: 'Date of the follow-up', example: '2026-10-07' })
  @IsDateString()
  @IsOptional()
  follow_up_date?: string;

  @ApiPropertyOptional({ description: 'Type of follow-up (e.g., Call, Meeting)', example: 'Call' })
  @IsString()
  @IsOptional()
  follow_up_type?: string;

  @ApiPropertyOptional({ description: 'Outcome of the follow-up', example: 'Interested' })
  @IsString()
  @IsOptional()
  outcome?: string;

  @ApiPropertyOptional({ description: 'Next scheduled action date', example: '2026-10-14' })
  @IsDateString()
  @IsOptional()
  next_action_date?: string;

  @ApiPropertyOptional({ description: 'Any additional remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
