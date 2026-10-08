import {
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaginateDto } from '../../../../common/dto/paginate.dto';
import {
  ActionType,
  ContextTypes,
} from '../../../../database/models/system/sys_permission.model';

const ALLOWED_SORT_FIELDS = [
  'id',
  'key',
  'name',
  'resource',
  'action',
  'context',
  'featureId',
  'createdAt',
] as const;

export type PermissionSortField =
  (typeof ALLOWED_SORT_FIELDS)[number];

export class QueryPermissionDto extends PartialType(
  PaginateDto,
) {
  @ApiPropertyOptional({
    description: 'Filter by feature ID',
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  featureId?: number;

  @ApiPropertyOptional({
    description:
      'Filter by module ID through permission feature',
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  moduleId?: number;

  @ApiPropertyOptional({
    description: 'Filter by resource name',
    example: 'permission',
  })
  @IsString()
  @IsOptional()
  resource?: string;

  @ApiPropertyOptional({
    description: 'Filter by action type',
    enum: ActionType,
  })
  @IsEnum(ActionType)
  @IsOptional()
  action?: ActionType;

  @ApiPropertyOptional({
    description: 'Filter by context type',
    enum: ContextTypes,
  })
  @IsEnum(ContextTypes)
  @IsOptional()
  context?: ContextTypes;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ALLOWED_SORT_FIELDS,
  })
  @IsString()
  @IsIn(ALLOWED_SORT_FIELDS, {
    message: `Sort field must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`,
  })
  @IsOptional()
  sortField?: PermissionSortField;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsEnum(['ASC', 'DESC'], {
    message: 'Sort order must be ASC or DESC',
  })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
