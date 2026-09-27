import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  MaxLength,
} from 'class-validator';
import { StatusEnum } from '@/database/enum/status.enum';

export class CreateSysOfficeDto {
  @ApiProperty({ example: 'Head Office' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({
    description:
      'Latitude for attendance geofence',
    example: '23.810331',
  })
  @Transform(({ value }) =>
    value === undefined ||
    value === null ||
    value === ''
      ? undefined
      : String(value).trim(),
  )
  @IsOptional()
  @IsString()
  @MaxLength(30)
  latitude?: string;

  @ApiPropertyOptional({
    description:
      'Longitude for attendance geofence',
    example: '90.412521',
  })
  @Transform(({ value }) =>
    value === undefined ||
    value === null ||
    value === ''
      ? undefined
      : String(value).trim(),
  )
  @IsOptional()
  @IsString()
  @MaxLength(30)
  longitude?: string;

  @ApiPropertyOptional({
    description: 'Human-readable location name',
    example: 'Head Office Branch',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationName?: string;

  @ApiPropertyOptional({
    description:
      'Google Maps location URL or coordinates for attendance verification',
    example:
      'https://maps.google.com/?q=23.8103,90.4125',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  attendanceLocation?: string;

  @ApiPropertyOptional({
    description:
      'Attendance allowed radius in meters from the office location',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  attendanceRadiusMeters?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 150)
  slug?: string;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsOptional()
  status?: StatusEnum;

  // enum remove -> string input
  @ApiProperty({
    example: 'FACTORY',
  })
  @IsString()
  @IsNotEmpty()
  officeType!: string;

  // FACTORY hole required
  @ValidateIf(
    (o) =>
      String(o.officeType).toUpperCase() ===
      'FACTORY',
  )
  @IsNotEmpty({
    message:
      'factoryId is required for FACTORY office type',
  })
  @Type(() => Number)
  @IsInt()
  factoryId?: number;

  // SHOWROOM hole required
  @ValidateIf(
    (o) =>
      String(o.officeType).toUpperCase() ===
      'SHOWROOM',
  )
  @IsNotEmpty({
    message:
      'showroomId is required for SHOWROOM office type',
  })
  @Type(() => Number)
  @IsInt()
  showroomId?: number;
}
