import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateCrmCategoryDto {
  @ApiProperty({ example: 'VIP Investor', description: 'Name of category' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'CAT-VIP' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: 'High net-worth clients' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmCategoryDto extends PartialType(CreateCrmCategoryDto) {}

export class CreateCrmStageDto {
  @ApiProperty({ example: 'Follow-up', description: 'Stage title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_system?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmStageDto extends PartialType(CreateCrmStageDto) {}

export class CreateCrmSourceDto {
  @ApiProperty({ example: 'Facebook Ad', description: 'Lead source name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'SRC-FB' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmSourceDto extends PartialType(CreateCrmSourceDto) {}

export class CreateCrmCampaignDto {
  @ApiProperty({ example: 'Summer Housing Fair 2026' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional({ example: 500000 })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ example: 'Social Media' })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'Campaign description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmCampaignDto extends PartialType(CreateCrmCampaignDto) {}

export class CreateCrmProfessionDto {
  @ApiProperty({ example: 'Doctor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Medical practitioner' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmProfessionDto extends PartialType(CreateCrmProfessionDto) {}

export class CreateCrmTeamDto {
  @ApiProperty({ example: 'Alpha Sales Force' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'USR-001' })
  @IsString()
  @IsOptional()
  leader_id?: string;

  @ApiPropertyOptional({ example: 'Direct Sales' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmTeamDto extends PartialType(CreateCrmTeamDto) {}

export class CreateCrmAreaDto {
  @ApiProperty({ example: 'Uttara Sector 4' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'North' })
  @IsString()
  @IsOptional()
  zone?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmAreaDto extends PartialType(CreateCrmAreaDto) {}

export class CreateCrmFeatureDto {
  @ApiProperty({ example: 'Corner Plot' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'CNR' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: 'Feature description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmFeatureDto extends PartialType(CreateCrmFeatureDto) {}

export class CreateCrmPriceRangeDto {
  @ApiProperty({ example: '50L - 1Cr' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsNumber()
  @IsOptional()
  min_price?: number;

  @ApiPropertyOptional({ example: 10000000 })
  @IsNumber()
  @IsOptional()
  max_price?: number;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmPriceRangeDto extends PartialType(CreateCrmPriceRangeDto) {}

export class CreateCrmRequirementTypeDto {
  @ApiProperty({ example: 'Apartment' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'REQ-APT' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmRequirementTypeDto extends PartialType(CreateCrmRequirementTypeDto) {}

export class CreateCrmVisitPlaceDto {
  @ApiProperty({ example: 'Site Office - Dhanmondi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Road 27, Dhanmondi, Dhaka' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  contact_person?: string;

  @ApiPropertyOptional({ example: '+8801700000000' })
  @IsString()
  @IsOptional()
  contact_number?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmVisitPlaceDto extends PartialType(CreateCrmVisitPlaceDto) {}

export class CreateCrmVisitStatusDto {
  @ApiProperty({ example: 'Completed' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '#10B981' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmVisitStatusDto extends PartialType(CreateCrmVisitStatusDto) {}

export class CreateCrmTaskTypeDto {
  @ApiProperty({ example: 'Client Call' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'TASK-CALL' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmTaskTypeDto extends PartialType(CreateCrmTaskTypeDto) {}


