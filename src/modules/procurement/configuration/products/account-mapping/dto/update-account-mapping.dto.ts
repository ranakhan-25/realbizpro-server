/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateAccountMappingDto } from './create-account-mapping.dto';

export class UpdateAccountMappingDto extends PartialType(
  CreateAccountMappingDto,
) {}
