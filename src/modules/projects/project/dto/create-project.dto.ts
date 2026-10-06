
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ProjectStatusEnum } from 'src/database/models/projects/project/pr_project_model';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Unique project code',
    example: 'P9756621',
  })
  @IsString()
  @IsNotEmpty({ message: 'Project code is required' })
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Project name',
    example: 'Skyline Heights',
  })
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Project type',
    example: 'Office',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  projectType?: string;

  @ApiPropertyOptional({
    description: 'Area category',
    example: 'Central',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  areaCategory?: string;

  @ApiPropertyOptional({
    description: 'Location / Address',
    example: 'Gulshan-2, Dhaka',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  location?: string;

  @ApiPropertyOptional({
    description: 'Total budget in BDT',
    example: 15000000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  totalBudget?: number;

  @ApiPropertyOptional({
    description: 'Contact person name',
    example: 'Shamim Khan',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  contactPersonName?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+8801700000000',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Client email',
    example: 'client@domain.com',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (value === '' ? null : value))
  clientEmail?: string;

  @ApiPropertyOptional({
    description: 'Contractor company name',
    example: 'BuildTech Ltd',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  contractorCompany?: string;

  @ApiPropertyOptional({
    description: 'Project manager name',
    example: 'Shamim Khan',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  projectManager?: string;

  @ApiPropertyOptional({
    description: 'Number of storeys',
    example: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  numberOfStoreys?: number;

  @ApiPropertyOptional({
    description: 'Project start date',
    example: '2026-09-01',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'startDate must be a valid date' })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Project end date',
    example: '2026-12-31',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'endDate must be a valid date' })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Progress percentage (0-100)',
    example: 45,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage?: number;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Corporate headquarters expansion and interior setup.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  description?: string;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: ProjectStatusEnum,
    default: ProjectStatusEnum.ACTIVE,
    example: ProjectStatusEnum.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProjectStatusEnum, {
    message: `status must be one of: ${Object.values(ProjectStatusEnum).join(', ')}`,
  })
  status?: ProjectStatusEnum;
}