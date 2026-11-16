/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationDto } from './create-registration.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateRegistrationDto extends PartialType(CreateRegistrationDto) {
  @IsString() @IsOptional() updatedBy?: string;
}