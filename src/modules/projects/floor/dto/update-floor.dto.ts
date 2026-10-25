/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateFloorDto } from './create-floor.dto';

export class UpdateFloorDto extends PartialType(CreateFloorDto) {}