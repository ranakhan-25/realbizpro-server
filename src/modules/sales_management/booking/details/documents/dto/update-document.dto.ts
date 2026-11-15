/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsString() @IsOptional() updatedBy?: string;
}