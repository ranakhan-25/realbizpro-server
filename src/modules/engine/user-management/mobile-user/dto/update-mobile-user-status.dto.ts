import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { StatusEnumD } from '@/database/enum/status.enum';

const toBoolean = ({
  value,
}: any): boolean | undefined => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return undefined;
  }

  if (
    value === true ||
    value === 'true' ||
    value === 1 ||
    value === '1'
  ) {
    return true;
  }

  if (
    value === false ||
    value === 'false' ||
    value === 0 ||
    value === '0'
  ) {
    return false;
  }

  return Boolean(value);
};

export class UpdateMobileUserStatusDto {
  @ApiPropertyOptional({
    example: true,
    description:
      'Update the face registration flag',
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isFaceRegistered?: boolean;

  @ApiPropertyOptional({
    example: true,
    description:
      'Update the email verification flag',
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({
    enum: StatusEnumD,
    example: StatusEnumD.ACTIVE,
    description: 'Update the mobile user status',
  })
  @IsOptional()
  @IsEnum(StatusEnumD)
  status?: StatusEnumD;
}
