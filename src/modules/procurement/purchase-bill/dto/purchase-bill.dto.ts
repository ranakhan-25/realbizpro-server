import { IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class CreatePurchaseBillDto {
  @IsDateString() date: string;
  @IsUUID() supplier_id: string;
  @IsArray() @IsUUID('4', { each: true }) grn_ids: string[];
  @IsOptional() @IsUUID() company_id?: string;
  @IsOptional() @IsUUID() project_type_id?: string;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) paid?: number;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsString() attachment?: string;
}
export class UpdatePurchaseBillDto extends CreatePurchaseBillDto {}
export class QueryPurchaseBillDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsUUID() supplier_id?: string;
}
