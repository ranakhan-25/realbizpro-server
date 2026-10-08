/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ProjectStatus } from 'src/database/models';



export class CreateProjectDto {
  @ApiProperty({
    description: 'Unique project code',
    example: 'PRJ-2026-001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Project code is required',
  })
  code: string;

  @ApiProperty({
    description: 'Project name',
    example: 'Rifat Eyecon City',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Project name is required',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Project type',
    example: 'Residential',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  projectType?: string;

  @ApiPropertyOptional({
    description: 'Project area category',
    example: 'Uttara',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  areaCategory?: string;

  @ApiPropertyOptional({
    description: 'Project location',
    example: 'Dhaka, Bangladesh',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  location?: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'A modern residential project',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  description?: string;

  @ApiPropertyOptional({
    description: 'Project start date',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Project end date',
    example: '2028-12-31',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Contact person name',
    example: 'Hasibul Islam',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  contactPersonName?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '01712345678',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Client email',
    example: 'client@example.com',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  clientEmail?: string;

  @ApiPropertyOptional({
    description: 'Contractor company name',
    example: 'ABC Construction Ltd.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  contractorCompany?: string;

  @ApiPropertyOptional({
    description: 'Project manager name',
    example: 'Md. Shamim',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  projectManager?: string;

  @ApiPropertyOptional({
    description: 'Project budget',
    example: 50000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({
    description: 'Number of storeys',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  storeys?: number;

  @ApiPropertyOptional({
    description: 'Project progress percentage',
    example: 25,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number = 0;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({
    description: 'Created by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Updated by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Deleted by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  deletedBy?: string;
}