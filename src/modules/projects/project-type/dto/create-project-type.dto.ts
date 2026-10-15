import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectTypeDto {
  @ApiPropertyOptional({
    description: 'Unique project type code',
    example: 'P4773027',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiProperty({
    description: 'Project type name',
    example: 'Residential',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}