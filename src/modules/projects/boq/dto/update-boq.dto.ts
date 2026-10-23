/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateBoqDto } from './create-boq.dto';

export class UpdateBoqDto extends PartialType(
  CreateBoqDto,
) {}
