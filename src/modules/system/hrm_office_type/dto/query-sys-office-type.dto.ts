import {
  PartialType,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateDto } from '@/common/dto/paginate.dto';
export enum StatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export class QuerySysOfficeTypeDto extends PartialType(
  PaginateDto,
) {
  @ApiPropertyOptional({
    enum: StatusEnum,
    example: StatusEnum.ACTIVE,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by sort order',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}
