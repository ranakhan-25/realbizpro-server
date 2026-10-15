import { PartialType } from '@nestjs/swagger';
import { CreateSalaryGradeDto } from './create-salary-grade.dto';

export class UpdateSalaryGradeDto extends PartialType(
  CreateSalaryGradeDto,
) {}
