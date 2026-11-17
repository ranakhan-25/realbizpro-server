/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsOptional, IsISO8601, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInstallmentDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsISO8601({ strict: true })
  dueDate: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  paidDate?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString() @IsOptional() addedBy?: string;
  @IsString() @IsOptional() addedById?: string;
}