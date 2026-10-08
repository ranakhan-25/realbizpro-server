import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class OfficeDropdownQueryDto {
  @ApiPropertyOptional({
    example: 'Factory',
    description: 'Single office type filter',
  })
  @IsString()
  @IsOptional()
  officeType?: string;

  @ApiPropertyOptional({
    example: [
      'Factory',
      'Showroom',
      'Head Office',
    ],
    description: 'Multiple office type filter',
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value))
      return value.map(String);
    return String(value)
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  })
  @IsArray()
  @IsString({ each: true })
  officeTypes?: string[];

  @ApiPropertyOptional({
    description: 'Filter by Factory UUID',
  })
  @IsUUID()
  @IsOptional()
  factoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Showroom UUID',
  })
  @IsUUID()
  @IsOptional()
  showroomId?: string;
}
