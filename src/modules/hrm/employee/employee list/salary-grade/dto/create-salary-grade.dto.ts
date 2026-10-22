import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SalaryGradeStatus } from 'src/database/models/hrm/employee/hrm_salary_grade_model';

export class CreateSalaryGradeDto {
  @ApiProperty({
    description: 'Salary grade name',
    example: 'Grade-A',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Salary grade name is required',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;

  @ApiPropertyOptional({
    description: 'Salary grade status',
    enum: SalaryGradeStatus,
    default: SalaryGradeStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(SalaryGradeStatus)
  status?: SalaryGradeStatus;
}
