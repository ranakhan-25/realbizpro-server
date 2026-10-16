/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BonusStatus } from 'src/database/models/hrm/employee/hrm_bonus_model';

export class CreateBonusDto {
  @ApiProperty({
    description: 'Bonus name',
    example: 'Eid-ul-Fitr Bonus',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Bonus name is required',
  })
  name: string;

  @ApiProperty({
    description:
      'Bonus percentage (0 - 100, max 2 decimal places)',
    example: 50,
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Percentage must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({
    description: 'Festival date (YYYY-MM-DD)',
    example: '2026-03-20',
  })
  @IsDateString(
    {},
    {
      message:
        'Festival date must be a valid date (YYYY-MM-DD)',
    },
  )
  festivalDate: string;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;

  @ApiPropertyOptional({
    description: 'Bonus status',
    enum: BonusStatus,
    default: BonusStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(BonusStatus)
  status?: BonusStatus;
}
