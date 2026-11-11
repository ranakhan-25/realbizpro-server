/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class QueryOverviewDto {
  @IsString() @IsOptional() search?: string;
  @IsNumberString() @IsOptional() page?: string;
  @IsNumberString() @IsOptional() limit?: string;
}