import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { UserTypeEnum } from '../../../../database/models/system/sys_user.model';

export class UserFilterDropdownDto {
  @ApiProperty({
    description: 'Distribution ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : Number(value),
  )
  @IsInt({
    message: 'distributionId must be an integer',
  })
  distributionId?: number;

  @ApiProperty({
    description: 'Warehouse ID',
    example: 2,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : Number(value),
  )
  @IsInt({
    message: 'warehouseId must be an integer',
  })
  warehouseId?: number;

  @ApiProperty({
    description: 'Factory ID',
    example: 3,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : Number(value),
  )
  @IsInt({
    message: 'factoryId must be an integer',
  })
  factoryId?: number;

  @ApiProperty({
    description: 'Department ID',
    example: 4,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : Number(value),
  )
  @IsInt({
    message: 'departmentId must be an integer',
  })
  departmentId?: number;

  @ApiProperty({
    description: 'Designation ID',
    example: 5,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : Number(value),
  )
  @IsInt({
    message: 'designationId must be an integer',
  })
  designationId?: number;

  @ApiProperty({
    description: 'Section ID',
    example: 6,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : Number(value),
  )
  @IsInt({
    message: 'sectionId must be an integer',
  })
  sectionId?: number;

  @ApiProperty({
    description: 'Unit ID',
    example: 7,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : Number(value),
  )
  @IsInt({ message: 'unitId must be an integer' })
  unitId?: number;

  @ApiPropertyOptional({
    description: 'User Type',
    example: 'Office',
    enum: Object.values(UserTypeEnum),
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : String(value),
  )
  userType?: UserTypeEnum;

  //search keyword
  @ApiPropertyOptional({
    description: 'Search Keyword',
    example: 'john.doe',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : String(value),
  )
  search?: string;
}
