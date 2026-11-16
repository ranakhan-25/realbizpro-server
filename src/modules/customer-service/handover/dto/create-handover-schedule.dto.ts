import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateHandoverScheduleDto {
  @ApiProperty({
    description: 'Purchaser customer full name',
    example: 'Mohammad Rafiqul Islam',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customer_name: string;

  @ApiProperty({
    description: 'Unit designation',
    example: 'A-7, Hena Heights',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  unit_name: string;

  @ApiPropertyOptional({
    description: 'Project name',
    example: 'Hena Heights, Gulshan',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  project_name?: string;

  @ApiPropertyOptional({
    description: 'Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Booking UUID',
  })
  @IsOptional()
  @IsString()
  booking_id?: string;

  @ApiPropertyOptional({
    description: 'Customer Profile ID',
  })
  @IsOptional()
  customer_profile_id?: number;

  @ApiPropertyOptional({
    description: 'Target handover date (YYYY-MM-DD)',
    example: '2026-11-20',
  })
  @IsOptional()
  @IsString()
  target_handover_date?: string;

  @ApiPropertyOptional({
    description: 'Physical readiness percentage (0 to 100)',
    example: 95,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  readiness_percentage?: number;

  @ApiPropertyOptional({
    description: 'Whether joint walkthrough/inspection is complete',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  joint_inspection_done?: boolean;

  @ApiPropertyOptional({
    description: 'Handover lifecycle status',
    default: 'Scheduled',
    example: 'Ready for Key Delivery',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  handover_status?: string;

  @ApiPropertyOptional({
    description: 'Key Register Number (if assigned)',
    example: 'KEY-2026-00388',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  key_register_no?: string;

  @ApiPropertyOptional({
    description: 'Whether possession certificate is issued',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  possession_cert_issued?: boolean;

  @ApiPropertyOptional({
    description: 'Remarks or hand-over notes',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
