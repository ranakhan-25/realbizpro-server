import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateLegalDocumentDto {
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @IsString()
  @IsOptional()
  document_type?: string;

  @IsString()
  @IsOptional()
  document_number?: string;

  @IsDateString()
  @IsOptional()
  issue_date?: string;

  @IsString()
  @IsOptional()
  file_path?: string;

  @IsString()
  @IsOptional()
  verification_status?: string;

  @IsString()
  @IsOptional()
  vetting_remarks?: string;
}
