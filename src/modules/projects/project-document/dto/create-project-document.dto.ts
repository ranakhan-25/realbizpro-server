import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProjectDocumentDto {
  @ApiProperty({
    description: 'UUID of the related project',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 'Land Deed Copy' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  documentName: string;

  @ApiPropertyOptional({ example: 'Legal', default: 'General' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (value === '' ? 'General' : value))
  documentType?: string;

  @ApiPropertyOptional({ example: 'Original deed papers scanned.' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  details?: string;

  @ApiPropertyOptional({ example: 'RAJUK clearance certificate.' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  rajuk?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
