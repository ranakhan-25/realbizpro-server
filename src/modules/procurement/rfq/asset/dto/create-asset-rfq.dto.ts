import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreateAssetRfqItemDto {
  @ApiProperty({ description: 'Asset item UUID' }) @IsUUID() item_id: string;
  @ApiProperty({ example: 1 }) @Type(() => Number) @IsNumber() @Min(0) quantity: number;
  @ApiPropertyOptional({ example: 100 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) rate?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() details?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) required_qty?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) purchase_qty?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) stock_qty?: number;
}

export class CreateAssetRfqDto {
  @ApiProperty({ example: '2026-10-22' }) @IsDateString() date: string;
  @ApiProperty({ description: 'SupplierAccounts UUID' }) @IsUUID() supplier_id: string;
  @ApiPropertyOptional({ example: 'PUR7229626' }) @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() company_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_type_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() title_of_work_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() task_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() site_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() category_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() requisition_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reference?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachment?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() added_by_id?: number;
  @ApiProperty({ type: [CreateAssetRfqItemDto] }) @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CreateAssetRfqItemDto) items: CreateAssetRfqItemDto[];
}
