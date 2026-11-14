import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UtilityTicketCategoryEnum {
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  SANITARY = 'Sanitary',
  OTHER = 'Other',
}

export enum UtilityTicketPriorityEnum {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  EMERGENCY = 'Emergency',
}

export class CreateUtilityTicketDto {
  @ApiProperty({ description: 'Project UUID to scope the utility ticket' })
  @IsNotEmpty()
  @IsUUID('4')
  project_id: string;

  @ApiProperty({ description: 'Flat or unit number', example: 'Flat 7-A' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  unit: string;

  @ApiProperty({ description: 'Claimant flat owner name', example: 'Engr. Mahbubur Rahman' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  customer_name: string;

  @ApiPropertyOptional({ description: 'Customer contact phone number', example: '+8801712345678' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customer_phone?: string;

  @ApiProperty({
    description: 'Utility claim category',
    enum: UtilityTicketCategoryEnum,
    example: UtilityTicketCategoryEnum.PLUMBING,
  })
  @IsNotEmpty()
  @IsEnum(UtilityTicketCategoryEnum)
  category: UtilityTicketCategoryEnum;

  @ApiProperty({
    description: 'Problem description',
    example: 'Low water pressure in master bathroom line, suspected air lock in stop cock.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Dispatch priority level',
    enum: UtilityTicketPriorityEnum,
    default: UtilityTicketPriorityEnum.MEDIUM,
  })
  @IsOptional()
  @IsEnum(UtilityTicketPriorityEnum)
  priority?: UtilityTicketPriorityEnum;

  @ApiPropertyOptional({ description: 'Assign technician ID (optional during creation)' })
  @IsOptional()
  @IsInt()
  technician_id?: number;

  @ApiPropertyOptional({
    description: 'Linked Warranty Registry item ID (if fixture is under warranty)',
  })
  @IsOptional()
  @IsInt()
  warranty_item_id?: number;

  @ApiPropertyOptional({
    description: 'Estimated service charge (used if ticket is PAID / out of warranty)',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimated_charge?: number;
}

