/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  ZkTecoDeviceStatus,
  ZkTecoDeviceType,
} from 'src/database/models/hrm/configuration/zkteco_device_model';

export class CreateZkTecoDeviceDto {
  @ApiProperty({
    description: 'Device type',
    enum: ZkTecoDeviceType,
    example: ZkTecoDeviceType.ADMS,
  })
  @IsEnum(ZkTecoDeviceType, {
    message:
      'Type must be one of: ' +
      Object.values(ZkTecoDeviceType).join(', '),
  })
  type: ZkTecoDeviceType;

  @ApiProperty({
    description: 'Device name',
    example: 'Main Gate Device',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Device name is required',
  })
  name: string;

  @ApiProperty({
    description: 'Device SN / SN NO',
    example: 'CKUB123456789',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Device SN is required',
  })
  sn: string;

  @ApiPropertyOptional({
    description:
      'IP address (required for Real IP type)',
    example: '192.168.1.201',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim() || null
      : value,
  )
  @IsString()
  ip?: string;

  @ApiPropertyOptional({
    description:
      'Port (required for Real IP type)',
    example: '4370',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === null ||
    value === undefined ||
    value === ''
      ? null
      : String(value).trim(),
  )
  @IsString()
  @Matches(/^\d{1,5}$/, {
    message: 'Port must be a number (1-65535)',
  })
  port?: string;

  @ApiPropertyOptional({
    description:
      'Last online date-time (ISO 8601)',
    example: '2026-10-20T08:00:00.000Z',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsDateString(
    {},
    {
      message: 'Last online must be a valid date',
    },
  )
  lastOnline?: string;

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
    description: 'ZkTeco device status',
    enum: ZkTecoDeviceStatus,
    default: ZkTecoDeviceStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ZkTecoDeviceStatus)
  status?: ZkTecoDeviceStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
