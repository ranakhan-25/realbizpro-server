/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateBoqComparisonDto } from './create-boqcomparison.dto';


export class UpdateBoqComparisonDto extends PartialType(CreateBoqComparisonDto) {}