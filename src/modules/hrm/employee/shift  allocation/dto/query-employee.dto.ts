// import { ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   Transform,
//   Type,
// } from 'class-transformer';
// import {
//   IsBoolean,
//   IsEnum,
//   IsInt,
//   IsOptional,
//   IsString,
//   Max,
//   Min,
// } from 'class-validator';
// import { EmployeeStatus } from 'src/database/models/hrm/employee/hrm_employee_model';

// export class QueryEmployeeDto {
//   @ApiPropertyOptional({ default: 1 })
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   page?: number = 1;

//   @ApiPropertyOptional({ default: 10 })
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @Max(100)
//   limit?: number = 10;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(0)
//   skip?: number;

//   @ApiPropertyOptional({ example: 'EMP' })
//   @IsOptional()
//   @IsString()
//   search?: string;

//   @ApiPropertyOptional({ enum: EmployeeStatus })
//   @IsOptional()
//   @IsEnum(EmployeeStatus)
//   status?: EmployeeStatus;

//   @ApiPropertyOptional({ default: 'createdAt' })
//   @IsOptional()
//   @IsString()
//   sortBy?: string = 'createdAt';

//   @ApiPropertyOptional({ default: 'DESC' })
//   @IsOptional()
//   @IsString()
//   sortOrder?: 'ASC' | 'DESC' = 'DESC';

//   @ApiPropertyOptional({ default: false })
//   @IsOptional()
//   @Transform(
//     ({ value }) =>
//       value === 'true' || value === true,
//   )
//   @IsBoolean()
//   withDeleted?: boolean = false;
// }
