import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateProcurementAssetItemEntryDto {
  @ApiPropertyOptional({ example: 'AST-0001', description: 'Auto-generated when omitted' })
  @IsOptional() @IsString() @MaxLength(100) item_code?: string;

  @ApiProperty({ example: 'Office Generator' })
  @IsString() @IsNotEmpty() @MaxLength(255) name: string;

  @ApiProperty({ description: 'UUID of Procurement Asset Category' })
  @IsUUID() @IsNotEmpty() category_id: string;

  @ApiProperty({ description: 'UUID of Procurement Unit' })
  @IsUUID() @IsNotEmpty() unit_id: string;

  @ApiPropertyOptional({ description: 'UUID of Procurement Brand' })
  @IsOptional() @IsUUID() brand_id?: string;

  @ApiPropertyOptional({ example: 1200, default: 0 })
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) purchase_price?: number;

  @ApiPropertyOptional({ example: 301, description: 'Chart of Groups ID (master source not available in this backend yet)' })
  @IsOptional() @Type(() => Number) @IsNumber() chart_of_group_id?: number;

  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional() @IsString() createdBy?: string;
}
