import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  ActionType,
  ContextTypes,
} from '../../../../database/models/system/sys_permission.model';
import { Is } from 'sequelize-typescript';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Unique permission key',
    example: 'create_user',
    maxLength: 150,
  })
  @IsString()
  @MaxLength(150)
  key: string;

  @ApiProperty({
    description: 'Permission name',
    example: 'Create User',
    maxLength: 150,
  })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    description: 'Permission description',
    example: 'Allows creating new users',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Resource name',
    example: 'user',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  resource: string;

  @ApiPropertyOptional({
    description: 'Action type',
    enum: ActionType,
    example: ActionType.CREATE,
  })
  @IsOptional()
  @IsEnum(ActionType)
  action: ActionType;

  @ApiPropertyOptional({
    description: 'Context type',
    enum: ContextTypes,
    example: ContextTypes.ANY,
  })
  @IsOptional()
  @IsEnum(ContextTypes)
  context: ContextTypes;

  @ApiPropertyOptional({
    description:
      'Feature ID associated with the permission',
    example: 1,
  })
  @IsOptional()
  featureId?: number;
}
