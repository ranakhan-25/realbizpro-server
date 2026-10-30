import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({
    description: 'Feature name',
    example: 'user-management',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Feature description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Module ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  moduleId?: number;

  @ApiPropertyOptional({
    description: 'Allowed actions for this feature',
    example: ['read', 'write', 'update', 'delete'],
  })
  @IsOptional()
  @IsArray()
  @IsIn(['read', 'write', 'update', 'delete'], { each: true })
  actions?: string[];
}
