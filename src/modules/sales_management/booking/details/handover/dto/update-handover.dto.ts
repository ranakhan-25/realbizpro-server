/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateHandoverDto } from './create-handover.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateHandoverDto extends PartialType(CreateHandoverDto) {
  @IsString() @IsOptional() updatedBy?: string;
}