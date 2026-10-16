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
} from 'class-validator';

export class NestedMaterialRequisitionItemDto {
  @ApiProperty({ example: 'ITEM-001' })
  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @ApiPropertyOptional({ example: 'Cement Bag' })
  @IsString()
  @IsOptional()
  itemName?: string;

  @ApiPropertyOptional({
    example: 'OPC 50kg bag',
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ example: 'Bag' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: 100 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  budgetQty?: number;

  @ApiPropertyOptional({ example: 20 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  alreadyPurchaseQty?: number;

  @ApiPropertyOptional({ example: 80 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  availableQty?: number;

  @ApiPropertyOptional({ example: 30 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  demandQty?: number;

  @ApiPropertyOptional({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  stock?: number;
}
