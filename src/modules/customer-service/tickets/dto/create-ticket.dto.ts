import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TicketCategory, TicketPriority, TicketStatus } from 'src/database/models/customer-service/cs_tickets.types';

export class CreateServiceTicketDto {
  @ApiProperty({
    description: 'Ticket Subject',
    example: 'Tiles Cracked in Master Bathroom',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  subject: string;

  @ApiProperty({
    description: 'Customer Full Name',
    example: 'Khandaker Monirul Alam',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customer_name: string;

  @ApiPropertyOptional({
    description: 'Customer contact phone',
    example: '+880 1711-445566',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Unit / Flat designation',
    example: 'Flat 6-A',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  unit?: string;

  @ApiPropertyOptional({
    description: 'Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Project Name',
    example: 'Hena Heights, Gulshan-2',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  project_name?: string;

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
  @IsNumber()
  customer_profile_id?: number;

  @ApiPropertyOptional({
    description: 'Ticket Category',
    enum: TicketCategory,
    default: TicketCategory.CIVIL_WORK,
  })
  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;

  @ApiPropertyOptional({
    description: 'Ticket Priority',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({
    description: 'Initial Ticket Status',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({
    description: 'Assigned Agent user ID',
  })
  @IsOptional()
  @IsNumber()
  assigned_agent_id?: number;

  @ApiPropertyOptional({
    description: 'Assigned Agent full name',
    example: 'Engr. Tariqul Hasan (Site Engr)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  assigned_agent?: string;

  @ApiPropertyOptional({
    description: 'Initial notes or description',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
