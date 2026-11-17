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
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BonusGenerateStatus } from 'src/database/models/hrm/employee/hrm_bonus_generate_model';

export class CreateBonusGenerateDto {
  @ApiProperty({
    description: 'Bonus UUID',
    example: 'bonus-uuid',
  })
  @IsUUID('all', {
    message: 'Bonus id must be a valid UUID',
  })
  @IsNotEmpty({ message: 'Bonus id is required' })
  bonusId: string;

  @ApiProperty({
    description: 'Employee UUID',
    example: 'employee-uuid',
  })
  @IsUUID('all', {
    message: 'Employee id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'Employee id is required',
  })
  employeeId: string;

  @ApiProperty({
    description:
      'Bonus amount (max 2 decimal places)',
    example: 5000,
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Amount must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(9999999999.99)
  amount: number;

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
    description: 'Bonus generate status',
    enum: BonusGenerateStatus,
    default: BonusGenerateStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(BonusGenerateStatus)
  status?: BonusGenerateStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
