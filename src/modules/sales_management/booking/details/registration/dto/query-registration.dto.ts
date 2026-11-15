/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';

export class QueryRegistrationDto {
  @IsString() @IsOptional() search?: string;
  @IsString() @IsOptional() status?: string;
}