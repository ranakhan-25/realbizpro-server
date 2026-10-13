/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateBonusGenerateDto } from './create-bonus-generate.dto';

export class UpdateBonusGenerateDto extends PartialType(
  CreateBonusGenerateDto,
) {}
