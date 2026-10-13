import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class CreateCrmLeadDto {
  @ApiProperty({ example: 'LEAD-2026-001', description: 'Unique lead code' })
  @IsString()
  @IsNotEmpty()
  lead_code: string;

  @ApiProperty({ example: 'Engr. Mahfuzur Rahman', description: 'Client full name' })
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @ApiProperty({ example: '+8801712345678', description: 'Primary phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: '+8801812345678' })
  @IsString()
  @IsOptional()
  alternate_phone?: string;

  @ApiPropertyOptional({ example: 'mahfuz@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 1, description: 'Category ID' })
  @IsNumber()
  @IsOptional()
  lead_category_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Stage ID' })
  @IsNumber()
  @IsOptional()
  lead_stage_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Source ID' })
  @IsNumber()
  @IsOptional()
  lead_source_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Campaign ID' })
  @IsNumber()
  @IsOptional()
  campaign_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Profession ID' })
  @IsNumber()
  @IsOptional()
  profession_id?: number;

  @ApiPropertyOptional({ example: 'Chief Architect' })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiPropertyOptional({ example: 'Creative Systems Ltd.' })
  @IsString()
  @IsOptional()
  organization?: string;

  @ApiPropertyOptional({ example: 'House 12, Road 4, Sector 7, Uttara, Dhaka' })
  @IsString()
  @IsOptional()
  present_address?: string;

  @ApiPropertyOptional({ example: 'Cumilla Sadar' })
  @IsString()
  @IsOptional()
  permanent_address?: string;

  @ApiPropertyOptional({ example: 'USR-002', description: 'Assigned Sales Agent ID' })
  @IsString()
  @IsOptional()
  assigned_to?: string;

  @ApiPropertyOptional({ example: 'high', enum: ['low', 'medium', 'high', 'urgent'] })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ example: 75 })
  @IsNumber()
  @IsOptional()
  lead_score?: number;

  @ApiPropertyOptional({ example: 'active' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'Interested in luxury duplex near golf club' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmLeadDto extends PartialType(CreateCrmLeadDto) {}

export class CreateCrmLeadRequirementDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  requirement_type_id?: number;

  @ApiPropertyOptional({ example: 'Plot' })
  @IsString()
  @IsOptional()
  property_type?: string;

  @ApiPropertyOptional({ example: 'Purbachal' })
  @IsString()
  @IsOptional()
  preferred_area?: string;

  @ApiPropertyOptional({ example: 2160 })
  @IsNumber()
  @IsOptional()
  size_sqft?: number;

  @ApiPropertyOptional({ example: 5000000 })
  @IsNumber()
  @IsOptional()
  budget_min?: number;

  @ApiPropertyOptional({ example: 8000000 })
  @IsNumber()
  @IsOptional()
  budget_max?: number;

  @ApiPropertyOptional({ example: 'South-facing preferred' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class CreateCrmLeadPropertyInterestDto {
  @ApiPropertyOptional({ example: 'Green Valley Phase 2' })
  @IsString()
  @IsOptional()
  project_name?: string;

  @ApiPropertyOptional({ example: 'Plot # 45, Road # 7' })
  @IsString()
  @IsOptional()
  plot_flat_no?: string;

  @ApiPropertyOptional({ example: '5 Katha' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({ example: 6000000 })
  @IsNumber()
  @IsOptional()
  quoted_price?: number;

  @ApiPropertyOptional({ example: 5600000 })
  @IsNumber()
  @IsOptional()
  client_offered_price?: number;

  @ApiPropertyOptional({ example: 'interested' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class CreateCrmLeadActivityDto {
  @ApiProperty({
    example: 'call',
    enum: ['call', 'meeting', 'visit', 'whatsapp', 'email', 'follow_up'],
  })
  @IsString()
  @IsNotEmpty()
  activity_type: string;

  @ApiProperty({ example: '2026-10-14T10:00:00Z' })
  @IsDateString()
  activity_date: string;

  @ApiProperty({ example: 'Client requested brochure and payment schedule for 5 katha plot' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiPropertyOptional({ example: 'Discussed 36-month installment plan' })
  @IsString()
  @IsOptional()
  discussion_points?: string;

  @ApiPropertyOptional({ example: '2026-10-18T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  next_followup_date?: string;

  @ApiPropertyOptional({ example: 'Positive' })
  @IsString()
  @IsOptional()
  feedback?: string;

  @ApiPropertyOptional({ example: 'USR-002' })
  @IsString()
  @IsOptional()
  conducted_by?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class CreateCrmLeadCallAssignDto {
  @ApiProperty({ example: 'USR-MANAGER' })
  @IsString()
  @IsNotEmpty()
  assigned_from: string;

  @ApiProperty({ example: 'USR-AGENT-01' })
  @IsString()
  @IsNotEmpty()
  assigned_to: string;

  @ApiProperty({ example: '2026-10-14T09:00:00Z' })
  @IsDateString()
  assignment_date: string;

  @ApiPropertyOptional({ example: '2026-10-15T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({ example: 'high' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ example: 'Call client to invite for project site visit on Saturday' })
  @IsString()
  @IsOptional()
  instruction?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class TransferCrmLeadDto {
  @ApiProperty({ example: 'USR-AGENT-01' })
  @IsString()
  @IsNotEmpty()
  transferred_from: string;

  @ApiProperty({ example: 'USR-AGENT-02' })
  @IsString()
  @IsNotEmpty()
  transferred_to: string;

  @ApiProperty({ example: 'Territory reallocation' })
  @IsString()
  @IsNotEmpty()
  transfer_reason: string;

  @ApiPropertyOptional({ example: 'USR-MANAGER' })
  @IsString()
  @IsOptional()
  approved_by?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class ChangeCrmLeadStageDto {
  @ApiProperty({ example: 2, description: 'New Stage ID' })
  @IsNumber()
  @IsNotEmpty()
  lead_stage_id: number;

  @ApiPropertyOptional({ example: 'Stage updated after successful site visit' })
  @IsString()
  @IsOptional()
  notes?: string;
}
