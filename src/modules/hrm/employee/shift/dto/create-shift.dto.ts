import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ShiftStatus } from 'src/database/models/hrm/employee/hrm_shift_model';
import { ShiftDayName } from 'src/database/models/hrm/employee/hrm_shift_schedule_model';

export class ShiftScheduleDto {
  @ApiProperty({
    description: 'Day of week',
    enum: ShiftDayName,
    example: ShiftDayName.SATURDAY,
  })
  @IsEnum(ShiftDayName)
  day: ShiftDayName;

  @ApiPropertyOptional({
    description:
      'Is the day enabled for this shift',
    default: true,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  enabled?: boolean = true;

  @ApiPropertyOptional({
    description: 'Shift start time (HH:mm)',
    example: '10:01',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'fromTime must be a valid time (HH:mm or HH:mm:ss)',
    },
  )
  fromTime?: string;

  @ApiPropertyOptional({
    description: 'Shift end time (HH:mm)',
    example: '18:00',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'toTime must be a valid time (HH:mm or HH:mm:ss)',
    },
  )
  toTime?: string;
}

export class CreateShiftDto {
  @ApiProperty({
    description: 'Shift name',
    example: 'Morning',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Shift name is required',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;

  @ApiPropertyOptional({
    description: 'Shift status',
    enum: ShiftStatus,
    default: ShiftStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ShiftStatus)
  status?: ShiftStatus;

  @ApiPropertyOptional({
    description: 'Weekly day-wise schedule',
    type: [ShiftScheduleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShiftScheduleDto)
  schedules?: ShiftScheduleDto[];
}
