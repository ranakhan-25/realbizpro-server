/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateSalaryGradeItemDto } from './create-salary-grade-item.dto';

export class UpdateSalaryGradeItemDto extends PartialType(
  CreateSalaryGradeItemDto,
) {}
