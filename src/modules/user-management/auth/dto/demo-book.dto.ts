import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string'
    ? value.trim()
    : value;

export class DemoBookDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Easy Soft Ltd',
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty({
    message: 'Organization name is required',
  })
  @MaxLength(255)
  organizationName: string;

  @ApiProperty({
    description: 'Organization location',
    example: 'Dhaka, Bangladesh',
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty({
    message: 'Organization location is required',
  })
  @MaxLength(255)
  organizationLocation: string;

  @ApiProperty({
    description: 'Organization email',
    example: 'info@company.com',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  @IsEmail(
    {},
    {
      message:
        'Please provide a valid email address',
    },
  )
  @MaxLength(255)
  organizationEmail: string;

  @ApiProperty({
    description: 'Organization established year',
    example: 2015,
  })
  @Type(() => Number)
  @IsInt({
    message:
      'Organization year must be an integer',
  })
  @Min(1800)
  @Max(2100)
  organizationYear: number;

  @ApiProperty({
    description:
      'Requested demo date (YYYY-MM-DD)',
    example: '2026-11-05',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Demo date is required',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'demoDate must be in YYYY-MM-DD format',
  })
  demoDate: string;

  @ApiProperty({
    description:
      'Contact person who will be available for the virtual meeting',
    example: 'Rahim Uddin',
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty({
    message: 'Contact person name is required',
  })
  @MaxLength(255)
  contactPersonName: string;

  @ApiPropertyOptional({
    description:
      'Meeting time (HH:mm or HH:mm:ss)',
    example: '15:30',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'meetingTime must be in HH:mm or HH:mm:ss format',
    },
  )
  meetingTime?: string;

  @ApiProperty({
    description: 'Trade license number',
    example: 'TRAD/DSCC/012345/2024',
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty({
    message: 'Trade license is required',
  })
  @MaxLength(255)
  tradeLicense: string;
}
