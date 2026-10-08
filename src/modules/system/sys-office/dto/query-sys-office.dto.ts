import {
  PartialType,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsInt,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

import { PaginateDto } from '@/common/dto/paginate.dto';
import { StatusEnum } from '@/database/enum/status.enum';

export class QuerySysOfficeDto extends PartialType(
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
    example: 'FACTORY',
  })
  @IsString()
  @IsOptional()
  officeType?: string;

  // Factory Filter
  @ApiPropertyOptional({
    example: '',
    description: 'Filter by factory id',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  factoryId?: number;

  // Showroom Filter
  @ApiPropertyOptional({
    example: '',
    description: 'Filter by showroom id',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  showroomId?: number;
}
