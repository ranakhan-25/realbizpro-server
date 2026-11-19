import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommChannel, CommStatus, CommType } from 'src/database/models/customer-service/cs_communication.types';

export class CreateCommunicationMessageDto {
  @ApiPropertyOptional({ description: 'Customer Name' })
  @IsOptional()
  @IsString()
  customer_name?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Customer Phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Customer Email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Unit or Flat Code' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Project Name' })
  @IsOptional()
  @IsString()
  project_name?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  projectName?: string;

  @ApiPropertyOptional({ description: 'Project plain alias' })
  @IsOptional()
  @IsString()
  project?: string;

  @ApiPropertyOptional({ description: 'Booking UUID' })
  @IsOptional()
  @IsString()
  booking_id?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiProperty({ enum: CommChannel, default: CommChannel.SMS })
  @IsNotEmpty()
  channel: CommChannel;

  @ApiProperty({ enum: CommType, default: CommType.PAYMENT_REMINDER })
  @IsNotEmpty()
  type: CommType;

  @ApiPropertyOptional({ description: 'Subject or Message Title' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ description: 'Message body or template content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Subject or preview snippet alias' })
  @IsOptional()
  @IsString()
  subject_or_preview?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  subjectOrPreview?: string;

  @ApiPropertyOptional({ enum: CommStatus })
  @IsOptional()
  status?: CommStatus;

  @ApiPropertyOptional({ description: 'Internal dispatch notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Scheduled dispatch ISO timestamp' })
  @IsOptional()
  @IsString()
  scheduled_for?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  scheduledFor?: string;

  @ApiPropertyOptional({ description: 'Arbitrary metadata payload' })
  @IsOptional()
  metadata?: Record<string, any>;
}
