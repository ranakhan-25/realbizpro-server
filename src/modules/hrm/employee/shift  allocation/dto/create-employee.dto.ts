import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmployeeStatus } from 'src/database/models/hrm/employee/hrm_employee_model';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'EMP-001' })
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @ApiProperty({ example: 'Hasibul Islam' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
