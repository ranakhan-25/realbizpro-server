import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  ServiceRuleType,
  ServiceRuleStatus,
} from 'src/database/models/customer-service/cs_rules.types';

export class QueryServiceRuleDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Search term (rule_name, rule_code, trigger, department)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter tab (all, sla, routing, escalation, statutory)' })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ enum: ServiceRuleType })
  @IsOptional()
  @IsEnum(ServiceRuleType)
  rule_type?: ServiceRuleType;

  @ApiPropertyOptional({ enum: ServiceRuleStatus })
  @IsOptional()
  @IsEnum(ServiceRuleStatus)
  status?: ServiceRuleStatus;
}
