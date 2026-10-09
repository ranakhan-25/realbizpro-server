/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateFlatLandDto } from './create-flatland.dto';


export class UpdateFlatLandDto extends PartialType(CreateFlatLandDto) {}