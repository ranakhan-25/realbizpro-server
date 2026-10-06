import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProjectSiteDto {
  @ApiProperty({
    description: 'Unique site code',
    example: 'P1171952',
  })
  @IsString()
  @IsNotEmpty({ message: 'Site code is required' })
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Site name',
    example: 'Site Alpha - Block A',
  })
  @IsString()
  @IsNotEmpty({ message: 'Site name is required' })
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Site location',
    example: 'Uttara Sector 11, Dhaka',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  location?: string;

  @ApiPropertyOptional({
    description: 'Site description',
    example: 'Residential piling & foundation work',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  description?: string;

  @ApiPropertyOptional({
    description: 'Project Type',
    example: 'Residential',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  projectType?: string;

  @ApiProperty({
    description: 'Related Project ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty({ message: 'Project is required' })
  projectId: number;
}