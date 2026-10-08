import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateInvPurchaseItemDto {
  @ApiProperty({ description: 'Item UUID', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @ApiProperty({ description: 'Quantity', example: 10 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: 'Rate per unit', example: 150.50 })
  @IsNumber()
  @Min(0)
  rate: number;

  @ApiProperty({ description: 'Total amount for this item (qty * rate)', example: 1505.00 })
  @IsNumber()
  @Min(0)
  amount: number;
}
