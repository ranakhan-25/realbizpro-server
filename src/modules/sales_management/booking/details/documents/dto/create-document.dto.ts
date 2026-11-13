/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class CreateDocumentDto {
  @IsString() category: string;
  @IsString() fileName: string;
  @IsString() fileUrl: string;
  @IsString() @IsOptional() fileSize?: string;
  @IsString() @IsOptional() fileType?: string;
  @IsISO8601({ strict: true }) uploadedDate: string;
}