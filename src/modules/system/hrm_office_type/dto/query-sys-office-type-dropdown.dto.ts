export enum StatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
} from 'class-validator';

export class DropdownSysOfficeTypeDto {
  @ApiPropertyOptional({
    enum: StatusEnum,
    example: StatusEnum.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}
