import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class FeatureNodeDto {
  @ApiPropertyOptional({ example: 1, description: 'Existing numeric ID or omit if creating fresh' })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional({ example: 'f3e2d1c0-ba98-7654-3210-fedcba987654' })
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiPropertyOptional({ example: 1, description: 'Parent module ID' })
  @IsOptional()
  @IsInt()
  moduleId?: number;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsOptional()
  @IsString()
  moduleUuid?: string;

  @ApiProperty({ example: 'Create Lead', description: 'Feature display title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'CRM_LEAD_CREATE', description: 'Machine feature code identifier' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: '/dashboard/crm/lead/create', description: 'Frontend route or API endpoint pattern' })
  @IsString()
  @IsOptional()
  routePath?: string;

  @ApiPropertyOptional({ example: 'write', description: 'Action type: read | write | admin | report' })
  @IsString()
  @IsOptional()
  actionType?: string;

  @ApiPropertyOptional({ example: ['read', 'write'], description: 'Feature actions array' })
  @IsArray()
  @IsOptional()
  actions?: string[];

  @ApiPropertyOptional({ example: 'Permission to add new prospective client leads' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateModuleTreeDto {
  @ApiPropertyOptional({ example: 1, description: 'ID if updating an existing module tree' })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiProperty({ example: 'CRM & Sales', description: 'Module header name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'CRM', description: 'Unique module code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: '/dashboard/crm', description: 'Base route path of module' })
  @IsString()
  @IsOptional()
  pathRoute?: string;

  @ApiPropertyOptional({ example: 'UserCheck', description: 'Lucide icon identifier' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'Customer relationship and lead acquisition' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    type: [FeatureNodeDto],
    description: 'Dynamic list of nested features added via the "+" button in the builder',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureNodeDto)
  features: FeatureNodeDto[];
}

export class FeatureNodeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'f3e2d1c0-ba98-7654-3210-fedcba987654' })
  uuid: string;

  @ApiProperty({ example: 1 })
  moduleId: number;

  @ApiProperty({ example: 'Create Lead' })
  name: string;

  @ApiProperty({ example: 'CRM_LEAD_CREATE' })
  code: string;

  @ApiProperty({ example: '/dashboard/crm/lead/create', nullable: true })
  routePath?: string;

  @ApiProperty({ example: 'write', nullable: true })
  actionType?: string;

  @ApiProperty({ example: ['read','write','update','delete'], description: 'Action list for the feature' })
  actions: string[];

  @ApiProperty({ example: 1, description: 'Display order for the feature' })
  displayOrder: number;

  @ApiProperty({ example: true, description: 'Whether the feature is active' })
  isActive: boolean;
}

export class ModuleTreeNodeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  uuid: string;

  @ApiProperty({ example: 'CRM & Sales' })
  name: string;

  @ApiProperty({ example: 'CRM' })
  code: string;

  @ApiProperty({ example: '/dashboard/crm', nullable: true })
  pathRoute?: string;

  @ApiProperty({ example: 'UserCheck', nullable: true })
  icon?: string;

  @ApiProperty({ example: 'Customer relationship and lead acquisition', nullable: true })
  description?: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: [FeatureNodeResponseDto] })
  features: FeatureNodeResponseDto[];
}
