import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({ example: 'Mirpur', maxLength: 150 })
  @IsString() @IsNotEmpty() @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active', example: 'active' })
  @IsOptional() @IsIn(['active', 'inactive'])
  declare status?: 'active' | 'inactive';
}
