import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryVisitStatusDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  declare limit?: number;

  @ApiPropertyOptional({ description: 'Search visit status by name' })
  @IsOptional() @IsString()
  declare search?: string;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean()
  declare withDeleted?: boolean;
}
