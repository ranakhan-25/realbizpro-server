import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { INTERNAL_TASK_PRIORITIES, INTERNAL_TASK_STATUSES } from './create-internal-task.dto';

export class QueryInternalTaskDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  declare limit?: number;

  @ApiPropertyOptional({ description: 'Search by title or description' })
  @IsOptional() @IsString()
  declare search?: string;

  @ApiPropertyOptional({ enum: INTERNAL_TASK_STATUSES })
  @IsOptional() @IsIn(INTERNAL_TASK_STATUSES)
  declare status?: typeof INTERNAL_TASK_STATUSES[number];

  @ApiPropertyOptional({ enum: INTERNAL_TASK_PRIORITIES })
  @IsOptional() @IsIn(INTERNAL_TASK_PRIORITIES)
  declare priority?: typeof INTERNAL_TASK_PRIORITIES[number];

  @ApiPropertyOptional({ description: 'Filter by project code' })
  @IsOptional() @IsString() @MaxLength(255)
  declare projectCode?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned user code' })
  @IsOptional() @IsString() @MaxLength(255)
  declare assignedTo?: string;
}
