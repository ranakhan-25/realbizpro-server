import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class QueryTeamDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({ example: 'Sales' })
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by team leader UUID' })
  @IsOptional() @IsString()
  @IsUUID()
  leaderUuid?: string;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean()
  withDeleted: boolean = false;

  @ApiPropertyOptional({ type: Number, description: 'Organization ID' })
  @IsOptional() @Type(() => Number) @IsInt()
  orgId?: number;
}
