import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
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
}
