import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { VisitorPurpose } from 'src/database/models/customer-service/cs_security.types';

export class CheckInVisitorDto {
  @ApiProperty({ description: 'Project UUID where visitor is entering' })
  @IsNotEmpty()
  @IsUUID('4')
  project_id: string;

  @ApiProperty({ description: 'Visitor full name', example: 'Kamal Uddin' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  visitor_name: string;

  @ApiProperty({ description: 'Visitor contact phone', example: '+8801811223344' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phone: string;

  @ApiProperty({ description: 'Flat or unit visited', example: 'A-301' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  flat_visited: string;

  @ApiProperty({
    description: 'Visit purpose',
    enum: ['Delivery', 'Guest / Personal', 'Contractor / Maintenance', 'Official / Courier', 'Other'],
    example: 'Guest / Personal',
  })
  @IsNotEmpty()
  @IsIn(['Delivery', 'Guest / Personal', 'Contractor / Maintenance', 'Official / Courier', 'Other'])
  purpose: VisitorPurpose;

  @ApiPropertyOptional({ description: 'Check-in timestamp (defaults to current time if omitted)' })
  @IsOptional()
  @IsDateString()
  in_time?: string;

  @ApiPropertyOptional({ description: 'Guard on duty ID logging the entry', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  guard_on_duty_id?: number;

  @ApiPropertyOptional({ description: 'Vehicle registration number (optional)', example: 'Dhaka Metro GA-11-2233' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  vehicle_number?: string;

  @ApiPropertyOptional({ description: 'Visitor National ID or Gate Pass Badge number', example: 'NID-992817263' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  national_id_or_badge?: string;

  @ApiPropertyOptional({ description: 'Security remarks or baggage notes', example: 'Carrying laptop bag' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
