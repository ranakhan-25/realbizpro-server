import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePriceRangeDto {
  @ApiProperty({ description: 'From Price (inclusive)', example: 10000000, minimum: 0 })
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  declare fromPrice: number;

  @ApiProperty({ description: 'To Price (inclusive)', example: 80000000, minimum: 0 })
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  declare toPrice: number;

  @ApiPropertyOptional({ type: Number, description: 'Organization ID' })
  @IsOptional() @Type(() => Number) @IsInt()
  declare orgId?: number;
}
