import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum AssigneeStatus {
  WAITING = 'waiting',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SKIPPED = 'skipped',
}

export class PendingApprovalDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by reference table name',
    example: 'hrm_leave_requests',
  })
  @IsOptional()
  @IsString()
  referenceTable?: string;

  @ApiPropertyOptional({
    description: 'Filter by workflow slug',
    example: 'leave-request',
  })
  @IsOptional()
  @IsString()
  workflowSlug?: string;

  @ApiPropertyOptional({
    description: 'Filter by assignee status',
    enum: AssigneeStatus,
    example: AssigneeStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(AssigneeStatus)
  status?: AssigneeStatus;

  //request Id
  @ApiPropertyOptional({
    description: 'Filter by request ID',
    example: 123,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  requestId?: number;
}
