/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class DemoBookQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Search in organization name, email, contact person, trade license',
    example: 'easy soft',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description:
      'Filter from date (YYYY-MM-DD) by demo date',
    example: '2026-10-01',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'dateFrom must be in YYYY-MM-DD format',
  })
  dateFrom?: string;

  @ApiPropertyOptional({
    description:
      'Filter to date (YYYY-MM-DD) by demo date',
    example: '2026-10-31',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'dateTo must be in YYYY-MM-DD format',
  })
  dateTo?: string;
}

export class UpdateDemoBookMeetingTimeDto {
  @ApiPropertyOptional({
    description:
      'Meeting time (HH:mm or HH:mm:ss)',
    example: '15:30',
  })
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'meetingTime must be in HH:mm or HH:mm:ss format',
    },
  )
  meetingTime: string;
}
