import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryTaskTypeDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  declare limit?: number;

  @ApiPropertyOptional({ description: 'Search by task type name or code' })
  @IsOptional() @IsString()
  declare search?: string;

  @ApiPropertyOptional({ enum: ['Active', 'Inactive'] })
  @IsOptional() @IsIn(['Active', 'Inactive'])
  declare status?: 'Active' | 'Inactive';

  @ApiPropertyOptional({ type: Boolean, default: false, description: 'Include inactive task types' })
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean()
  declare withInactive?: boolean;
}
