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
import { EmployeeListStatus } from 'src/database/models/hrm/employee/hrm_employeeList_model';
// import { EmployeeStatus } from 'src/database/models/hrm/employee/hrm_employee_model';

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
    enum: EmployeeListStatus,
    default: EmployeeListStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EmployeeListStatus)
  status?: EmployeeListStatus;
}
