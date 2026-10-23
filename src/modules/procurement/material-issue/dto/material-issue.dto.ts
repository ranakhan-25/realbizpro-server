import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class MaterialIssueItemDto {
  @IsUUID() grn_item_id: string;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
}

export class CreateMaterialIssueDto {
  @IsUUID() grn_id: string;
  @IsDateString() date: string;
  @IsString() purpose: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) issued_by_id?: number;
  @IsOptional() @IsString() notes?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => MaterialIssueItemDto) items: MaterialIssueItemDto[];
}

export class QueryMaterialIssueDto {
  @IsOptional() @IsString() grn_no?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() sort_by_date?: 'ASC' | 'DESC';
  @IsOptional() @IsDateString() date_from?: string;
  @IsOptional() @IsDateString() date_to?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number;
}
