import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  FeedbackFollowUpStatus,
  SurveyType,
} from 'src/database/models/customer-service/cs_communication.types';

export class CreateCustomerFeedbackDto {
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
    enum: SurveyType,
    default: SurveyType.HANDOVER_CSAT,
  })
  @IsNotEmpty()
  survey_type: SurveyType;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  surveyType?: SurveyType;

  @ApiPropertyOptional({
    description: 'CSAT Score 1 to 5',
    minimum: 1,
    maximum: 5,
    default: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  csat_score?: number;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  csatScore?: number;

  @ApiPropertyOptional({
    description: 'NPS Score 0 to 10',
    minimum: 0,
    maximum: 10,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  nps_score?: number;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  npsScore?: number;

  @ApiPropertyOptional({
    description: 'Detailed feedback comments',
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({
    enum: FeedbackFollowUpStatus,
  })
  @IsOptional()
  follow_up_status?: FeedbackFollowUpStatus;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  followUpStatus?: FeedbackFollowUpStatus;

  @ApiPropertyOptional({
    description: 'Assigned CX Officer User ID',
  })
  @IsOptional()
  assigned_officer_id?: number;

  @ApiPropertyOptional({
    description: 'Assigned CX Officer Name',
  })
  @IsOptional()
  @IsString()
  assigned_officer?: string;

  @ApiPropertyOptional({
    description: 'CamelCase alias',
  })
  @IsOptional()
  @IsString()
  assignedOfficer?: string;
}
