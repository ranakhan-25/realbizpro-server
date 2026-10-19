/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateZkTecoDeviceDto } from './create-zkteco-device.dto';

export class UpdateZkTecoDeviceDto extends PartialType(
  CreateZkTecoDeviceDto,
) {}
