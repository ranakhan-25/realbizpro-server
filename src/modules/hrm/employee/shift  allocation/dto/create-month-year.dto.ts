import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMonthYearDto {
  @ApiProperty({ example: 'October' })
  @IsString()
  @IsNotEmpty()
  month: string;

  @ApiProperty({ example: 2026 })
  @IsInt()
  @Min(2000)
  @Max(2200)
  year: number;
}
