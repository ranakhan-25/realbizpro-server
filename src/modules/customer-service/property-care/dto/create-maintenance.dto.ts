import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  MaintenanceType,
  MaintenanceStatus,
} from 'src/database/models/customer-service/cs_property_care.types';

export class CreateMaintenanceDto {
  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({ description: 'Project Name' })
  @IsOptional()
  @IsString()
  project_name?: string;

  @ApiProperty({ description: 'Facility or Equipment Name' })
  @IsNotEmpty()
  @IsString()
  facility: string;

  @ApiPropertyOptional({ enum: MaintenanceType, default: MaintenanceType.PREVENTIVE })
  @IsOptional()
  @IsEnum(MaintenanceType)
  maintenance_type?: MaintenanceType;

  @ApiPropertyOptional({ description: 'Scheduled Maintenance Date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  scheduled_date?: string;

  @ApiPropertyOptional({ description: 'Vendor / Contractor Name', default: 'In-house Facility Care' })
  @IsOptional()
  @IsString()
  vendor_name?: string;

  @ApiPropertyOptional({ description: 'Vendor ID' })
  @IsOptional()
  @IsNumber()
  vendor_id?: number;

  @ApiPropertyOptional({ description: 'Estimated Cost', default: 0 })
  @IsOptional()
  @IsNumber()
  cost_estimate?: number;

  @ApiPropertyOptional({ description: 'Actual Cost' })
  @IsOptional()
  @IsNumber()
  actual_cost?: number;

  @ApiPropertyOptional({ enum: MaintenanceStatus, default: MaintenanceStatus.SCHEDULED })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @ApiPropertyOptional({ description: 'Remarks or maintenance notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
