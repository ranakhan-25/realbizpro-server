/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChequeRangeDto {
  @IsString()
  cashBank: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  fromNumber: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  toNumber: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  numberOfCheque: number;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}