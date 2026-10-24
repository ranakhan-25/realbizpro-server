import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class OrgDetailsDto {
  @ApiProperty({ example: 'Apex Holdings Ltd.', description: 'Organization or Company Legal Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ORG_APEX', description: 'Unique alphanumeric identifier' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 'contact@apexholdings.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+8801711000000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Gulshan 2, Dhaka, Bangladesh' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID or UUID of selected SysPlan' })
  @IsOptional()
  planId?: number | string;

  @ApiPropertyOptional({ example: 30, description: 'Duration in days' })
  @IsInt()
  @IsOptional()
  durationDays?: number;

  @ApiPropertyOptional({ example: 14, description: 'Trial period in days' })
  @IsInt()
  @IsOptional()
  trialDays?: number;

  @ApiPropertyOptional({ example: 20, description: 'Max allowed user accounts' })
  @IsInt()
  @IsOptional()
  maxUsers?: number;

  @ApiPropertyOptional({ example: 10, description: 'Max active projects' })
  @IsInt()
  @IsOptional()
  maxProjects?: number;

  @ApiPropertyOptional({ example: 20480, description: 'Storage quota in MB' })
  @IsInt()
  @IsOptional()
  maxStorageMb?: number;
}

export class OrgAdminUserDto {
  @ApiProperty({ example: 'Tanvir Hossain', description: 'Full Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'tanvir_apex', description: 'Unique login username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin@apexholdings.com', description: 'Admin email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecureP@ss123', description: 'Raw password (will be argon2 hashed)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '+8801712345678' })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiPropertyOptional({ example: 'Managing Director' })
  @IsString()
  @IsOptional()
  designationName?: string;
}

export class ModuleFeatureSelectionDto {
  @ApiProperty({ example: 1, description: 'ID or UUID of parent module' })
  @IsNotEmpty()
  moduleId: number | string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of feature IDs/UUIDs granted to this organization',
  })
  @IsArray()
  featureIds: Array<number | string>;
}

export class CreateOrganizationWizardDto {
  @ApiProperty({ type: OrgDetailsDto, description: '1. Organization Profile & Subscription Limits' })
  @ValidateNested()
  @Type(() => OrgDetailsDto)
  organization: OrgDetailsDto;

  @ApiProperty({ type: OrgAdminUserDto, description: '2. Organization Administrator Credentials' })
  @ValidateNested()
  @Type(() => OrgAdminUserDto)
  adminUser: OrgAdminUserDto;

  @ApiProperty({
    type: [ModuleFeatureSelectionDto],
    description: '3. Tree of Modules & Features Granted to this Organization',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleFeatureSelectionDto)
  moduleFeatureAccess: ModuleFeatureSelectionDto[];
}
