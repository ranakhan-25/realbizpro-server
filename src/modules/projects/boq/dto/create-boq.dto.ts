/* eslint-disable prettier/prettier */

import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBoqDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  titleOfWork: string;

  @IsString()
  task: string;

  @IsNumber()
  budget: number;

  @IsNumber()
  percentageOfTotalBudget: number;

  @IsNumber()
  perSftBudget: number;

  @IsNumber()
  cost: number;

  @IsNumber()
  available: number;

  @IsOptional()
  @IsString()
  addedBy?: string;
}