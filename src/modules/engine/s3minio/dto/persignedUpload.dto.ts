import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PresignedUploadDto {
  @ApiProperty({
    description: 'File name with extension',
    example: 'report.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiPropertyOptional({
    description: 'Target bucket name',
    example: 'uploads',
  })
  @IsString()
  @IsOptional()
  bucket?: string;

  @ApiPropertyOptional({
    description: 'Folder path within bucket',
    example: 'reports/2025',
  })
  @IsString()
  @IsOptional()
  folder?: string;

  @ApiPropertyOptional({
    description: 'URL expiration time in seconds',
    example: 3600,
  })
  @IsNumber()
  @IsOptional()
  @Min(60)
  @Max(604800) // 7 days
  expiresIn?: number;
}
