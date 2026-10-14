// update-month-year.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateMonthYearDto } from './create-month-year.dto';

export class UpdateMonthYearDto extends PartialType(
  CreateMonthYearDto,
) {}
