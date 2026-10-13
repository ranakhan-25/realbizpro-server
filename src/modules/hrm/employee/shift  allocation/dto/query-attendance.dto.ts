import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AttendanceType } from 'src/database/models/hrm/employee/hrm_attendance_model';

export class QueryAttendanceDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    description:
      'Search attendance by day or note',
    example: 'Tuesday',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  monthYearId?: string;

  @ApiPropertyOptional({ example: '2026-10-13' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ enum: AttendanceType })
  @IsOptional()
  @IsEnum(AttendanceType)
  type?: AttendanceType;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  withDeleted?: boolean = false;
}
