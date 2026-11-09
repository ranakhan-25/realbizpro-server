import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  EmployeeListStatus,
  MaritalStatus,
} from 'src/database/models/hrm/employee/hrm_employeeList_model';

export class CreateEmployeeListDto {
  // ---------- basic information ----------

  @ApiProperty({
    description: 'Employee name',
    example: 'Abdur Rahim',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Employee name is required',
  })
  name: string;

  @ApiProperty({
    description: 'Employee code (unique)',
    example: 'EMP-0001',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Employee code is required',
  })
  employeeCode: string;

  @ApiPropertyOptional({
    description: 'Code',
    example: 'C-01',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '01700000000',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Phone number is required',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Secondary phone number',
    example: '01800000000',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  secondaryPhone?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'rahim@example.com',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  @IsEmail(
    {},
    {
      message:
        'Email must be a valid email address',
    },
  )
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Birth date (YYYY-MM-DD)',
    example: '1995-05-20',
  })
  @IsDateString(
    {},
    {
      message:
        'Birth date must be a valid date (YYYY-MM-DD)',
    },
  )
  birthDate: string;

  @ApiProperty({
    description: 'National ID',
    example: '1234567890',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'NID is required' })
  nid: string;

  @ApiPropertyOptional({
    description: 'TIN',
    example: '123456789012',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  tin?: string;

  @ApiProperty({
    description: 'Marital status',
    enum: MaritalStatus,
  })
  @IsEnum(MaritalStatus, {
    message:
      'Marital status must be one of: ' +
      Object.values(MaritalStatus).join(', '),
  })
  maritalStatus: MaritalStatus;

  // ---------- relations ----------

  @ApiPropertyOptional({
    description: 'Unit UUID',
    example: 'unit-uuid',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsUUID('all', {
    message: 'Unit id must be a valid UUID',
  })
  unitId?: string;

  @ApiPropertyOptional({
    description: 'Section UUID',
    example: 'section-uuid',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsUUID('all', {
    message: 'Section id must be a valid UUID',
  })
  sectionId?: string;

  @ApiProperty({
    description: 'Department UUID',
    example: 'department-uuid',
  })
  @IsUUID('all', {
    message: 'Department id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'Department id is required',
  })
  departmentId: string;

  @ApiProperty({
    description: 'Designation UUID',
    example: 'designation-uuid',
  })
  @IsUUID('all', {
    message:
      'Designation id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'Designation id is required',
  })
  designationId: string;

  @ApiPropertyOptional({
    description: 'Salary grade UUID',
    example: 'salary-grade-uuid',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsUUID('all', {
    message:
      'Salary grade id must be a valid UUID',
  })
  salaryGradeId?: string;

  @ApiProperty({
    description: 'Shift UUID',
    example: 'shift-uuid',
  })
  @IsUUID('all', {
    message: 'Shift id must be a valid UUID',
  })
  @IsNotEmpty({ message: 'Shift id is required' })
  shiftId: string;

  @ApiProperty({
    description: 'Employee type UUID',
    example: 'employee-type-uuid',
  })
  @IsUUID('all', {
    message:
      'Employee type id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'Employee type id is required',
  })
  employeeTypeId: string;

  @ApiProperty({
    description: 'Under UUID',
    example: 'under-uuid',
  })
  @IsUUID('all', {
    message: 'Under id must be a valid UUID',
  })
  @IsNotEmpty({ message: 'Under id is required' })
  underId: string;

  // ---------- job information ----------

  @ApiPropertyOptional({
    description:
      'Gross salary (max 2 decimal places)',
    example: 35000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Gross salary must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(9999999999.99)
  grossSalary?: number;

  @ApiProperty({
    description: 'Joining date (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsDateString(
    {},
    {
      message:
        'Joining date must be a valid date (YYYY-MM-DD)',
    },
  )
  joiningDate: string;

  @ApiPropertyOptional({
    description: 'Leave date (YYYY-MM-DD)',
    example: '2026-12-31',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsDateString(
    {},
    {
      message:
        'Leave date must be a valid date (YYYY-MM-DD)',
    },
  )
  leaveDate?: string;

  @ApiPropertyOptional({
    description: 'Image path or URL',
    example: '/uploads/employee/rahim.png',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'CV path or URL',
    example: '/uploads/employee/rahim-cv.pdf',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsString()
  cv?: string;

  @ApiPropertyOptional({
    description: 'Employee status',
    enum: EmployeeListStatus,
    default: EmployeeListStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EmployeeListStatus)
  status?: EmployeeListStatus;

  // ---------- flags ----------

  @ApiPropertyOptional({
    description: 'Has other information',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true'
      ? true
      : value === 'false'
        ? false
        : value,
  )
  @IsBoolean()
  hasOtherInformation?: boolean;

  @ApiPropertyOptional({
    description: 'Has nominee information',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true'
      ? true
      : value === 'false'
        ? false
        : value,
  )
  @IsBoolean()
  hasNomineeInformation?: boolean;

  @ApiPropertyOptional({
    description: 'Has bank information',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true'
      ? true
      : value === 'false'
        ? false
        : value,
  )
  @IsBoolean()
  hasBankInformation?: boolean;

  @ApiPropertyOptional({
    description: 'Create user account flag',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true'
      ? true
      : value === 'false'
        ? false
        : value,
  )
  @IsBoolean()
  createUser?: boolean;

  // ---------- nominee information ----------

  @ApiPropertyOptional({
    description: 'Nominee name',
    example: 'Karim',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  nomineeName?: string;

  @ApiPropertyOptional({
    description: 'Nominee phone',
    example: '01900000000',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  nomineePhone?: string;

  @ApiPropertyOptional({
    description: 'Nominee NID',
    example: '9876543210',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  nomineeNid?: string;

  @ApiPropertyOptional({
    description: 'Nominee image path or URL',
    example: '/uploads/employee/nominee.png',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsString()
  nomineeImage?: string;

  // ---------- bank information ----------

  @ApiPropertyOptional({
    description: 'Bank name',
    example: 'Islami Bank',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({
    description: 'Account holder name',
    example: 'Abdur Rahim',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  accountHolderName?: string;

  @ApiPropertyOptional({
    description: 'Account number',
    example: '1234567890123',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  accountNo?: string;

  @ApiPropertyOptional({
    description: 'Branch name',
    example: 'Dhanmondi',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  branchName?: string;

  @ApiPropertyOptional({
    description: 'SWIFT code',
    example: 'IBBLBDDH',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  swiftCode?: string;

  // ---------- audit ----------

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
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
