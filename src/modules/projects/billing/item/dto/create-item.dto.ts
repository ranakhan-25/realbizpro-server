/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'Item Name',
    example: 'Cement',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  itemName: string;

  @ApiPropertyOptional({
    description: 'Category UUID',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Sub Category UUID',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @ApiPropertyOptional({
    description: 'Brand',
    example: 'ABC',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Unit',
    example: 'Nos',
    default: 'Nos',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Purchase Price',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  purchasePrice?: number;

  @ApiPropertyOptional({
    description: 'Sale Price',
    example: 150,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({
    description: 'Image URL',
  })
  @IsOptional()
  @IsString()
  image?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
