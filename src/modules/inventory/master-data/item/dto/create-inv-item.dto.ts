import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateInvItemDto {
  @ApiProperty({ description: 'The unique code for the item', example: 'ITEM-001' })
  @IsString()
  @IsNotEmpty()
  item_code: string;

  @ApiProperty({ description: 'The display name of the item', example: 'Portland Cement' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'The type of the item', example: 'Material' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Purchase price of the item', example: 500.00 })
  @IsNumber()
  @IsNotEmpty()
  purchase_price: number;

  @ApiProperty({ description: 'Sale price of the item', example: 600.00 })
  @IsNumber()
  @IsNotEmpty()
  sale_price: number;

  @ApiProperty({ description: 'Category ID (UUID)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @ApiPropertyOptional({ description: 'Sub-Category ID (UUID)', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsOptional()
  sub_category_id?: string;

  @ApiPropertyOptional({ description: 'Brand ID (UUID)', example: '123e4567-e89b-12d3-a456-426614174002' })
  @IsUUID()
  @IsOptional()
  brand_id?: string;

  @ApiProperty({ description: 'Unit ID (UUID)', example: '123e4567-e89b-12d3-a456-426614174003' })
  @IsUUID()
  @IsNotEmpty()
  unit_id: string;
}
