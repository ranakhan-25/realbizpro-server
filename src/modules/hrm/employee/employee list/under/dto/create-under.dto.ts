import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UnderStatus } from 'src/database/models/hrm/employee/hrm_under_model';

export class CreateUnderDto {
  @ApiProperty({
    description: 'Under name',
    example: 'Head Office',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Under name is required',
  })
  name: string;

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
    description: 'Under status',
    enum: UnderStatus,
    default: UnderStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UnderStatus)
  status?: UnderStatus;
}
