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
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProjectStatusEnum } from 'src/database/models/projects/pr_project_types_model';

export class CreateProjectDto {
  @ApiPropertyOptional({
    description: 'Area ID',
    example: 'area-uuid-or-code',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  areaId?: string;

  @ApiProperty({
    description: 'Unique project code',
    example: 'PRJ-2026-001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Project code is required',
  })
  @MaxLength(100)
  code: string;

  @ApiProperty({
    description: 'Project name',
    example: 'Dhaka Metro Line Extension',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Project name is required',
  })
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Type of the project',
    example: 'Infrastructure',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  projectType?: string;

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
    example:
      'Extension of metro line from Motijheel to Airport',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  description?: string;

  @ApiPropertyOptional({
    description: 'Project start date',
    example: '2026-01-15T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: 'startDate must be a valid date',
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Project end date',
    example: '2028-12-31T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: 'endDate must be a valid date',
  })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: ProjectStatusEnum,
    default: ProjectStatusEnum.ONGOING,
    example: ProjectStatusEnum.ONGOING,
  })
  @IsOptional()
  @IsEnum(ProjectStatusEnum, {
    message: `status must be one of: ${Object.values(ProjectStatusEnum).join(', ')}`,
  })
  status?: ProjectStatusEnum;
}
