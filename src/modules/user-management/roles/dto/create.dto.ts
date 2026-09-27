import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    nullable: false,
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Role description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignMultiplePermissionsDto extends PartialType(
  CreateRoleDto,
) {
  @ApiProperty({
    description:
      'Array of permission IDs to assign to the role',
    example: [1, 2, 3, 4, 5],
    type: [Number],
    minItems: 1,
  })
  @IsArray()
  @IsNumber(
    {},
    {
      each: true,
      message:
        'Each permission ID must be a number',
    },
  )
  permissionIds: number[];

  //moduleId is optional
  @ApiPropertyOptional({
    description:
      'Module ID to filter permissions',
    example: 1,
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: 'Module ID must be a number' },
  )
  moduleId?: number;
}

export class CreateRoleWithPermissionsDto {
  @ApiProperty({
    description: 'Role name',
    nullable: false,
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Role description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description:
      'Array of permission IDs to assign to the role',
    example: [1, 2, 3, 4],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  permissionIds?: number[];
}
