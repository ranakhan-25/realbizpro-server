import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class ModuleQueryDto {
  @ApiPropertyOptional({
    example: 'User Management',
    description: 'Filter by name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
