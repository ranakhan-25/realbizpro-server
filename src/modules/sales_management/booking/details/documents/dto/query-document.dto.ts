/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class QueryDocumentDto {
  @IsString() @IsOptional() search?: string;
  @IsString() @IsOptional() category?: string;
  @IsNumberString() @IsOptional() page?: string;
  @IsNumberString() @IsOptional() limit?: string;
}