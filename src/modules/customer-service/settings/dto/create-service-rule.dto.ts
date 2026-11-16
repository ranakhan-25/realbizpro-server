import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ServiceRuleType,
  ServiceRuleStatus,
} from 'src/database/models/customer-service/cs_rules.types';

export class CreateServiceRuleDto {
  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({ description: 'Project Name' })
  @IsOptional()
  @IsString()
  project_name?: string;

  @ApiPropertyOptional({ description: 'Rule Code (auto-generated e.g. RUL-101 if omitted)' })
  @IsOptional()
  @IsString()
  rule_code?: string;

  @ApiProperty({ description: 'Rule Name' })
  @IsNotEmpty()
  @IsString()
  rule_name: string;

  @ApiPropertyOptional({
    enum: ServiceRuleType,
    default: ServiceRuleType.SLA_POLICY,
  })
  @IsOptional()
  @IsEnum(ServiceRuleType)
  rule_type?: ServiceRuleType;

  @ApiProperty({ description: 'Category or Trigger Condition' })
  @IsNotEmpty()
  @IsString()
  category_or_trigger: string;

  @ApiPropertyOptional({ description: 'First Response Target', default: '2 Hours' })
  @IsOptional()
  @IsString()
  first_response_target?: string;

  @ApiPropertyOptional({ description: 'Resolution Target', default: '24 Hours' })
  @IsOptional()
  @IsString()
  resolution_target?: string;

  @ApiPropertyOptional({ description: 'Escalation Target Protocol' })
  @IsOptional()
  @IsString()
  escalation_target?: string;

  @ApiPropertyOptional({
    description: 'Assigned Department',
    default: 'Site Engineering & QA',
  })
  @IsOptional()
  @IsString()
  assigned_department?: string;

  @ApiPropertyOptional({
    description: 'Operating Schedule',
    default: 'Office Hours (Sat-Thu 9am-6pm)',
  })
  @IsOptional()
  @IsString()
  operating_hours?: string;

  @ApiPropertyOptional({
    enum: ServiceRuleStatus,
    default: ServiceRuleStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ServiceRuleStatus)
  status?: ServiceRuleStatus;
}
