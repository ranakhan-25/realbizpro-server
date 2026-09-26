import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MenuQueryDto {
  @ApiPropertyOptional({
    example: 'Dashboard',
    description: 'Filter by title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: '/dashboard',
    description: 'Filter by URL',
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by parent menu ID',
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by module ID',
  })
  @IsOptional()
  @IsNumber()
  moduleId?: number;
}
