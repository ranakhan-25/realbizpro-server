/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateIncrementDto } from './create-increment.dto';

export class UpdateIncrementDto extends PartialType(
  CreateIncrementDto,
) {}
