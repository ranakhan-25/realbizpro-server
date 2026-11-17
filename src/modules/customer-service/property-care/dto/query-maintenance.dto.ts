import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  MaintenanceType,
  MaintenanceStatus,
} from 'src/database/models/customer-service/cs_property_care.types';

export class QueryMaintenanceDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Search term (facility, vendor_name, request_no, project_name)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter tab (all, active, completed)' })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ enum: MaintenanceType })
  @IsOptional()
  @IsEnum(MaintenanceType)
  maintenance_type?: MaintenanceType;

  @ApiPropertyOptional({ enum: MaintenanceStatus })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @ApiPropertyOptional({ description: 'Filter soft-deleted maintenance requests' })
  @IsOptional()
  is_deleted?: boolean;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  isDeleted?: boolean;
}
