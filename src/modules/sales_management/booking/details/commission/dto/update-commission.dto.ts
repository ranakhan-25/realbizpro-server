/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCommissionDto } from './create-commission.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCommissionDto extends PartialType(CreateCommissionDto) {
  @IsString() @IsOptional() updatedBy?: string;
}