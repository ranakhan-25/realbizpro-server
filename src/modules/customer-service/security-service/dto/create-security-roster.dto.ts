import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RosterStatus, ShiftName } from 'src/database/models/customer-service/cs_security.types';

export class CreateSecurityRosterDto {
  @ApiProperty({ description: 'Project UUID where duty is scheduled' })
  @IsNotEmpty()
  @IsUUID('4')
  project_id: string;

  @ApiProperty({ description: 'Guard ID to assign', example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  guard_id: number;

  @ApiProperty({ description: 'Duty date (YYYY-MM-DD)', example: '2026-11-08' })
  @IsNotEmpty()
  @IsDateString()
  duty_date: string;

  @ApiProperty({
    description: 'Shift name',
    enum: ['Morning', 'Evening', 'Night', 'Custom'],
    example: 'Morning',
  })
  @IsNotEmpty()
  @IsIn(['Morning', 'Evening', 'Night', 'Custom'])
  shift_name: ShiftName;

  @ApiProperty({ description: 'Shift start time (HH:MM or HH:MM:SS)', example: '06:00' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'shift_start must be in valid HH:MM or HH:MM:SS format',
  })
  shift_start: string;

  @ApiProperty({ description: 'Shift end time (HH:MM or HH:MM:SS)', example: '14:00' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'shift_end must be in valid HH:MM or HH:MM:SS format',
  })
  shift_end: string;

  @ApiProperty({ description: 'Duty post location', example: 'Main Entrance Gate 01' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  post_location: string;

  @ApiPropertyOptional({
    description: 'Initial roster status',
    enum: ['SCHEDULED', 'ON_DUTY', 'COMPLETED', 'ABSENT', 'RELIEVED'],
    default: 'SCHEDULED',
  })
  @IsOptional()
  @IsIn(['SCHEDULED', 'ON_DUTY', 'COMPLETED', 'ABSENT', 'RELIEVED'])
  status?: RosterStatus;

  @ApiPropertyOptional({ description: 'Handover or deployment notes', example: 'Reliever standby if needed' })
  @IsOptional()
  @IsString()
  notes?: string;
}
