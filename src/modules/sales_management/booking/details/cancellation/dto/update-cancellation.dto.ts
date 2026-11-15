/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCancellationDto } from './create-cancellation.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCancellationDto extends PartialType(CreateCancellationDto) {
  @IsString() @IsOptional() updatedBy?: string;
}