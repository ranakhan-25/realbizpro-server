import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({
    example: 'User Management',
    description: 'Module name',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Handles user and role management',
    description: 'Module description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
