/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateZkTecoDeviceDto } from './create-zkteco-device.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateZkTecoDeviceDto extends PartialType(
  CreateZkTecoDeviceDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
