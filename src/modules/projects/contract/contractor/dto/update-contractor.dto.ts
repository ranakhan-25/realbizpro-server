/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateContractorDto } from './create-contractor.dto';

export class UpdateContractorDto extends PartialType(
  CreateContractorDto,
) {}
