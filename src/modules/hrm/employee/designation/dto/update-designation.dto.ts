/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateDesignationDto } from './create-designation.dto';

export class UpdateDesignationDto extends PartialType(
  CreateDesignationDto,
) {}
