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
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { DeductionRuleType } from 'src/database/models/hrm/configuration/deduction_rule_model';

export class CreateDeductionRuleDto {
  @ApiProperty({
    description: 'Deduction rule type',
    enum: DeductionRuleType,
    example: DeductionRuleType.LATE,
  })
  @IsEnum(DeductionRuleType, {
    message:
      'Type must be one of: ' +
      Object.values(DeductionRuleType).join(', '),
  })
  type: DeductionRuleType;

  @ApiProperty({
    description: 'Rule title',
    example: 'Late Entry Rule',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Late time (minutes)',
    example: 15,
  })
  @Type(() => Number)
  @IsInt({
    message: 'Late time must be an integer',
  })
  @Min(0)
  @Max(1440)
  lateTime: number;

  @ApiProperty({
    description: 'Number of late days',
    example: 3,
  })
  @Type(() => Number)
  @IsInt({
    message: 'Late days must be an integer',
  })
  @Min(0)
  @Max(366)
  lateDays: number;

  @ApiProperty({
    description: 'Number of days to deduct',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({
    message: 'Deduction days must be an integer',
  })
  @Min(0)
  @Max(366)
  deductionDays: number;

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
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
