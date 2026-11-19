import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  VisitPurpose,
  VisitStatus,
} from 'src/database/models/customer-service/cs_communication.types';

export class CreateSiteVisitDto {
  @ApiPropertyOptional({
    description: 'Customer Name',
  })
  @IsOptional()
  @IsString()
  customer_name?: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Contact Phone',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Unit or Apartment Code',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Project Name',
  })
  @IsOptional()
  @IsString()
  project_name?: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  projectName?: string;

  @ApiPropertyOptional({
    description: 'Project plain alias',
  })
  @IsOptional()
  @IsString()
  project?: string;

  @ApiPropertyOptional({
    description: 'Booking UUID',
  })
  @IsOptional()
  @IsString()
  booking_id?: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiProperty({
    enum: VisitPurpose,
    default: VisitPurpose.MILESTONE_INSPECTION,
  })
  @IsNotEmpty()
  visit_purpose: VisitPurpose;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  visitPurpose?: VisitPurpose;

  @ApiProperty({
    description: 'Appointment Date (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsString()
  appointment_date: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  appointmentDate?: string;

  @ApiProperty({
    description:
      'Time Slot (e.g. 10:00 AM - 11:30 AM)',
  })
  @IsNotEmpty()
  @IsString()
  time_slot: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  timeSlot?: string;

  @ApiPropertyOptional({
    description: 'Escort User ID',
  })
  @IsOptional()
  assigned_escort_id?: number;

  @ApiPropertyOptional({
    description:
      'Assigned Escort name & designation',
  })
  @IsOptional()
  @IsString()
  assigned_escort?: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  assignedEscort?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  safety_ppe_required?: boolean;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsBoolean()
  safetyPpeRequired?: boolean;

  @ApiPropertyOptional({ enum: VisitStatus })
  @IsOptional()
  status?: VisitStatus;

  @ApiPropertyOptional({
    description:
      'Customer notes or special requests',
  })
  @IsOptional()
  @IsString()
  customer_notes?: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  customerNotes?: string;
}
