/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumber,
  IsISO8601,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemEntryDto {
  @IsString()
  itemName: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsISO8601({ strict: true })
  acquisitionDate: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  originalValue: number;

  @IsString()
  @IsOptional()
  method?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  bookValue?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  depreciableValue?: number;

  @IsString()
  @IsOptional()
  status?: string;
}