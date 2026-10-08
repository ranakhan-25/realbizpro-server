import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateS3minioDto {
  @ApiPropertyOptional({
    description: 'Folder path within bucket',
    example: 'documents/2025',
  })
  @IsString()
  @IsOptional()
  @Transform(
    ({ value }) => value?.trim() || undefined,
  )
  @MaxLength(200)
  pathFolder?: string;

  @ApiPropertyOptional({
    description: 'Custom filename',
    example: 'invoice-2025-001.pdf',
  })
  @IsString()
  @IsOptional()
  @Transform(
    ({ value }) => value?.trim() || undefined,
  )
  @MaxLength(255)
  fileName?: string;
}
