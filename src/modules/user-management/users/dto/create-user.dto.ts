import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  IsBangladeshPhone,
  IsPassword,
} from '../../../../common/decorators/validation.decorators';
import { UserTypeEnum } from '../../../../database/models/system/sys_user.model';

const toNumberArray = ({
  value,
}: any): number[] | undefined => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  )
    return undefined;
  const values = Array.isArray(value)
    ? value
    : [value];
  const numbers = values
    .flatMap((item) => String(item).split(','))
    .map((item) => Number(String(item).trim()))
    .filter(
      (item) => Number.isFinite(item) && item > 0,
    );
  return numbers.length ? numbers : undefined;
};

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail(
    {},
    {
      message:
        'Please provide a valid email address',
    },
  )
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString({
    message: 'First name must be a string',
  })
  @IsNotEmpty({
    message: 'First name is required',
  })
  firstName: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString({
    message: 'Last name must be a string',
  })
  @IsOptional()
  lastName: string;

  @ApiProperty({
    description: 'User phone number (optional)',
    example: '+8801711111111',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null ? undefined : typeof value === 'string' ? value.trim() : value,
  )
  @IsBangladeshPhone({
    message:
      'Please provide a valid Bangladesh phone number',
  })
  @IsString({
    message: 'Phone number must be a string',
  })
  phone?: string;

  @ApiProperty({
    description: 'Username (optional)',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null ? undefined : typeof value === 'string' ? value.trim() : value,
  )
  @IsString({
    message: 'Username must be a string',
  })
  username?: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  @IsString()
  @IsPassword()
  password: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description:
      'Designation ID assigned to the user',
    example: 3,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : Number(value),
  )
  @IsInt()
  designationId?: number;

  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
    required: false,
    default: [],
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @IsInt({ each: true })
  roleIds?: number[];

  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
    required: false,
    default: [],
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @IsInt({ each: true })
  moduleIds?: number[];

  @ApiProperty({
    example: [5, 10, 15],
    type: [Number],
    required: false,
    default: [],
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @IsInt({ each: true })
  permissionIds?: number[];

  @ApiProperty({
    example: [2, 4],
    type: [Number],
    required: false,
    default: [],
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  @ApiPropertyOptional({
    description: 'Type of the user',
    example: UserTypeEnum.OFFICE,
    enum: UserTypeEnum,
    default: UserTypeEnum.OFFICE,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === 'system' || value === '') return UserTypeEnum.OFFICE;
    return value;
  })
  @IsEnum(UserTypeEnum)
  userType?: UserTypeEnum;

  @ApiPropertyOptional({
    description:
      'Only for Office user: multiple office IDs assigned to user',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @IsInt({ each: true })
  officeIds?: number[];

  @ApiPropertyOptional({
    description:
      'Only for Office user: multiple office type IDs assigned to user',
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @IsInt({ each: true })
  officeTypeIds?: number[];

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : Number(value),
  )
  @IsInt()
  distributionId?: number;

  @ApiPropertyOptional({ example: 34 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : Number(value),
  )
  @IsInt()
  warehouseId?: number;

  @ApiPropertyOptional({ example: 78 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : Number(value),
  )
  @IsInt()
  receivingPointId?: number;

  @ApiPropertyOptional({ example: 56 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : Number(value),
  )
  @IsInt()
  factoryId?: number;

  @ApiPropertyOptional({ example: 78 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : Number(value),
  )
  @IsInt()
  unitId?: number;

  @ApiProperty({
    example: [2, 4],
    type: [Number],
    required: false,
    default: [],
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @IsInt({ each: true })
  sectionIds?: number[];

  @ApiProperty({
    example: [1, 2],
    type: [Number],
    required: false,
    default: [],
    description:
      'List of Company IDs assigned to the user',
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @IsInt({ each: true })
  companyIds?: number[];

  @ApiPropertyOptional({ example: 456 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : Number(value),
  )
  @IsInt()
  employeeId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Organization ID for multi-tenant isolation' })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined ? undefined : Number(value),
  )
  @IsInt()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Organization UUID' })
  @IsOptional()
  @IsString()
  orgUuid?: string;
}
