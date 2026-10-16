import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { AttendanceType } from 'src/database/models/hrm/employee/hrm_attendance_model';

export class CreateAttendanceDto {
  @ApiProperty({
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiPropertyOptional({
    example:
      '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  monthYearId?: string;

  @ApiProperty({ example: '2026-10-13' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiProperty({ example: 'Tuesday' })
  @IsString()
  @IsNotEmpty()
  day: string;

  @ApiPropertyOptional({ example: '09:00:00' })
  @IsOptional()
  @IsString()
  inTime?: string;

  @ApiPropertyOptional({ example: '18:00:00' })
  @IsOptional()
  @IsString()
  outTime?: string;

  @ApiPropertyOptional({
    example: 'Worked from home',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    enum: AttendanceType,
    default: AttendanceType.WORKDAY,
  })
  @IsOptional()
  @IsEnum(AttendanceType)
  type?: AttendanceType;
}
