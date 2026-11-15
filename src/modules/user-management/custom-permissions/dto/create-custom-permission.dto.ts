import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomPermissionDto {
  @ApiProperty({
    description: 'Custom permission display name',
    example: 'Allow View Customer Records',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Action selected by user (read, write, create, update, delete)',
    example: 'read',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional({
    description: 'Unique key or code for this permission',
    example: 'customer.read',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  key?: string;

  @ApiPropertyOptional({
    description: 'Associated feature ID',
    example: 418,
  })
  @IsOptional()
  featureId?: number;

  @ApiPropertyOptional({
    description: 'Resource name',
    example: 'customer',
  })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiPropertyOptional({
    description: 'Description of permission',
    example: 'Allows reading customer profiles',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
