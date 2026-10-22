import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProcurementItemEntryDto {
  @ApiProperty({ example: 'ITEM-0001' }) @IsString() @IsNotEmpty() item_code: string;
  @ApiProperty({ example: 'Soil Test Boring' }) @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional({ example: 0, default: 0 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) purchase_price?: number;
  @ApiPropertyOptional({ example: 0, default: 0 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) sale_price?: number;
  @ApiProperty({ description: 'Category UUID' }) @IsUUID() @IsNotEmpty() category_id: string;
  @ApiPropertyOptional({ description: 'Sub Category UUID; must belong to category_id' }) @IsOptional() @IsUUID() sub_category_id?: string;
  @ApiPropertyOptional({ description: 'Brand UUID' }) @IsOptional() @IsUUID() brand_id?: string;
  @ApiProperty({ description: 'Unit UUID' }) @IsUUID() @IsNotEmpty() unit_id: string;
  @ApiPropertyOptional() @IsOptional() @IsString() createdBy?: string;
}
