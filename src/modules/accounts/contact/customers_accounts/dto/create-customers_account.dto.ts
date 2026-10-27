/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsArray, 
  IsBoolean,
  IsEmail
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerAccountDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  business?: string;

  @IsString()
  mobile: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  nid?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  under?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  buyerReference?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  creditLimit?: number;

  @IsString()
  @IsOptional()
  chartOfGroups?: string;

  @IsArray()
  @IsOptional()
  nominees?: { name: string; nid: string; phone: string; relation: string; percentage: number }[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  createUser?: boolean;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}