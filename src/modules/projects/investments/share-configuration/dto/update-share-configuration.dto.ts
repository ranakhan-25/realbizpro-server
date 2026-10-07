/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';

import { CreateShareConfigurationDto } from './create-share-configuration.dto';

export class UpdateShareConfigurationDto extends PartialType(
  CreateShareConfigurationDto,
) {}
