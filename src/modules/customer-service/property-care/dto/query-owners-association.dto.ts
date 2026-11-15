import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AssociationGovernanceStatus } from 'src/database/models/customer-service/cs_property_care.types';

export class QueryOwnersAssociationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Search term (project_name, association_name, president_name, association_code)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter tab (all, handedover, developer)' })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ enum: AssociationGovernanceStatus })
  @IsOptional()
  @IsEnum(AssociationGovernanceStatus)
  handover_status?: AssociationGovernanceStatus;
}
