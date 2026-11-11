import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
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
import { ProjectStatus } from 'src/database/models/projects/project/pr_project.model';

export class CreateProjectDto {
  @ApiProperty({ example: 'PRJ-2026-001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Rifat Eyecon City' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Residential' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  projectType?: string | null;

  @ApiPropertyOptional({ example: 'Uttara' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  areaCategory?: string | null;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  location?: string | null;

  @ApiPropertyOptional({ example: 'A modern residential project' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  description?: string | null;

  @ApiPropertyOptional({ example: '2026-01-01', format: 'date' })
  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @ApiPropertyOptional({ example: '2028-12-31', format: 'date' })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ example: 'Hasibul Islam' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  contactPersonName?: string | null;

  @ApiPropertyOptional({ example: '01712345678' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  contactPhone?: string | null;

  @ApiPropertyOptional({ example: 'client@example.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (value === '' ? null : value))
  clientEmail?: string | null;

  @ApiPropertyOptional({ example: 'ABC Construction Ltd.' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  contractorCompany?: string | null;

  @ApiPropertyOptional({ example: 'Md. Shamim' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  projectManager?: string | null;

  @ApiPropertyOptional({ example: 50000000, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalBudget?: number | null;

  @ApiPropertyOptional({ example: 10, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  numberOfStoreys?: number | null;

  @ApiPropertyOptional({ example: 25, minimum: 0, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage?: number;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
