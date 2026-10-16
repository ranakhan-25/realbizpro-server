import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLegalDocumentDto {
  @ApiProperty({ description: 'UUID of the associated acquisition lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @ApiPropertyOptional({ description: 'Type of the document', example: 'Deed' })
  @IsString()
  @IsOptional()
  document_type?: string;

  @ApiPropertyOptional({ description: 'Document number', example: 'DOC-12345' })
  @IsString()
  @IsOptional()
  document_number?: string;

  @ApiPropertyOptional({ description: 'Issue date of the document', example: '2026-01-01' })
  @IsDateString()
  @IsOptional()
  issue_date?: string;

  @ApiPropertyOptional({ description: 'Path or URL to the uploaded file', example: 'https://example.com/doc.pdf' })
  @IsString()
  @IsOptional()
  file_path?: string;

  @ApiPropertyOptional({ description: 'Status of verification', example: 'Verified' })
  @IsString()
  @IsOptional()
  verification_status?: string;

  @ApiPropertyOptional({ description: 'Vetting remarks or notes', example: 'All documents are clear.' })
  @IsString()
  @IsOptional()
  vetting_remarks?: string;

  @ApiPropertyOptional({ description: 'Optional project identifier', example: 'PRJ-1001' })
  @IsString()
  @IsOptional()
  projectId?: string;
}
