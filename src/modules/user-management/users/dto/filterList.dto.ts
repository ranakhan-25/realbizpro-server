import {
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaginateDto } from '../../../../common/dto/paginate.dto';
import { UserTypeEnum } from '../../../../database/models/system/sys_user.model';

const ALLOWED_SORT_FIELDS = [
  'id',
  'status',
  'created_at',
] as const;

export type UserSortField =
  (typeof ALLOWED_SORT_FIELDS)[number];

export enum BooleanEnum {
  TRUE = 'true',
  FALSE = 'false',
}

export class QueryUserDto extends PartialType(
  PaginateDto,
) {
  @ApiPropertyOptional({
    description: 'Filter by active status',
    enum: BooleanEnum,
  })
  @IsEnum(BooleanEnum)
  @IsOptional()
  isActive?: BooleanEnum;

  //userType enum filter
  @ApiPropertyOptional({
    description: 'Filter by user type (array)',
    type: 'array',
    items: {
      type: 'string',
      enum: Object.values(UserTypeEnum),
    },
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(UserTypeEnum, { each: true })
  @IsOptional()
  userType?: UserTypeEnum[];

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ALLOWED_SORT_FIELDS,
  })
  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_SORT_FIELDS, {
    message: `Sort field must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`,
  })
  sortField?: UserSortField;

  @ApiPropertyOptional({
    description:
      'Sort order (ascending or descending)',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], {
    message: 'Sort order must be ASC or DESC',
  })
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'Filter by Distribution ID',

    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  distributionId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Warehouse ID',

    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  warehouseId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Factory ID',

    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  factoryId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Department ID',

    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Designation ID',

    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  designationId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Section ID',

    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  sectionId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Unit ID',

    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  unitId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Company ID',

    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  companyId?: number;
}
