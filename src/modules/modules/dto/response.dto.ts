import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class ModuleResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Module ID',
  })
  id: number;

  @ApiProperty({
    example: 'User Management',
    description: 'Module name',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Handles user and role management',
    description: 'Module description',
  })
  description?: string;
}
