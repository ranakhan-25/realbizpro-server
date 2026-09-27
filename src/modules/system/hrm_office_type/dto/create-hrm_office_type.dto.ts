import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
export enum StatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export class CreateSysOfficeTypeDto {
  @ApiProperty({ example: 'Head Office' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @ApiPropertyOptional({
    example: 'Corporate head office type',
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({
    example: 'head-office',
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  slug?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Sorting order',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({
    enum: StatusEnum,
    example: StatusEnum.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}
