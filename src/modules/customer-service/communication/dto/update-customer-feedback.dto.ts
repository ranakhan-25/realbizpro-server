import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FeedbackFollowUpStatus } from 'src/database/models/customer-service/cs_communication.types';

export class UpdateCustomerFeedbackDto {
  @ApiPropertyOptional({ enum: FeedbackFollowUpStatus })
  @IsOptional()
  follow_up_status?: FeedbackFollowUpStatus;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  followUpStatus?: FeedbackFollowUpStatus;

  @ApiPropertyOptional({ description: 'Resolution or escalation action notes' })
  @IsOptional()
  @IsString()
  action_notes?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  actionNotes?: string;

  @ApiPropertyOptional({ description: 'Resolution notes alias' })
  @IsOptional()
  @IsString()
  resolution_notes?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  resolutionNotes?: string;

  @ApiPropertyOptional({ description: 'Assigned Officer User ID' })
  @IsOptional()
  assigned_officer_id?: number;

  @ApiPropertyOptional({ description: 'Assigned Officer Name' })
  @IsOptional()
  @IsString()
  assigned_officer?: string;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  @IsString()
  assignedOfficer?: string;
}
