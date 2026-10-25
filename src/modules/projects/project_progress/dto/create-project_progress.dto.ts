/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsOptional, 
  IsNumber,
  Min,
  Max,
  IsISO8601, // ✅ IsDateString বাদ দিয়ে IsISO8601 ব্যবহার করুন
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectProgressDto {
  @IsUUID()
  projectUuid: string;

  // ✅ Fix: Date টাইপের বদলে string টাইপ করুন
  @IsISO8601({ strict: true }, { message: 'asOfDate must be a valid ISO 8601 date string' })
  asOfDate: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  physicalPct: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  financialPct: number;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @IsString()
  loggedBy: string;

  @IsUUID()
  loggedById: string;

  @IsString()
  @IsOptional()
  createdBy?: string;
}