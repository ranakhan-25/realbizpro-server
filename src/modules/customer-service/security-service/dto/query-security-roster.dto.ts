import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QuerySecurityRosterDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsUUID('4')
  project_id?: string;

  @ApiPropertyOptional({ description: 'Filter by guard ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  guard_id?: number;

  @ApiPropertyOptional({ description: 'Exact duty date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  duty_date?: string;

  @ApiPropertyOptional({ description: 'Start date for range filter (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'End date for range filter (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Filter by shift status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by shift name' })
  @IsOptional()
  @IsString()
  shift_name?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;
}

