import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

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
}
