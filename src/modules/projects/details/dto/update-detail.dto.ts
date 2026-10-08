/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailsDto } from './create-detail.dto';


export class UpdateDetailsDto extends PartialType(CreateDetailsDto) {}