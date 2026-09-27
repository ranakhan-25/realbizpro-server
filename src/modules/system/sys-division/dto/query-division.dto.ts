import { PaginateDto } from '@/common/dto/paginate.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryDivisionDto extends PaginateDto {
  // =========================
  // ID FILTERS
  // =========================

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @Type(() => Number)
  divisionId?: number;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @Type(() => Number)
  districtId?: number;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @Type(() => Number)
  upazilaId?: number;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @Type(() => Number)
  unionId?: number;

  // =========================
  // NAME FILTERS
  // =========================

  @ApiPropertyOptional({
    description:
      'Division name (English or Bangla)',
    example: '',
  })
  @IsOptional()
  @IsString()
  divisionName?: string;

  @ApiPropertyOptional({
    description:
      'District name (English or Bangla)',
    example: '',
  })
  @IsOptional()
  @IsString()
  districtName?: string;

  @ApiPropertyOptional({
    description:
      'Upazila name (English or Bangla)',
    example: '',
  })
  @IsOptional()
  @IsString()
  upazilaName?: string;

  @ApiPropertyOptional({
    description: 'Union name (English or Bangla)',
    example: '',
  })
  @IsOptional()
  @IsString()
  unionName?: string;
}
