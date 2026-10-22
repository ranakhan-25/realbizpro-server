/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateMonthYearDto } from './create-month-year.dto';

export class UpdateMonthYearDto extends PartialType(
  CreateMonthYearDto,
) {}
