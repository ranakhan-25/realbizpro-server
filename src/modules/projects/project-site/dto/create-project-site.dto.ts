import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
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

  @ApiProperty({
    description: 'Related Project ID',
    example: '6f5c7e7a-46df-4e46-9eb3-14a92805fac3',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Project is required' })
  projectId: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}