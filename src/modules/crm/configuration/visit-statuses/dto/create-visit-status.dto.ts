import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVisitStatusDto {
  @ApiProperty({ example: 'Visited', maxLength: 100 })
  @IsString() @IsNotEmpty() @MaxLength(100)
  declare name: string;

  @ApiPropertyOptional({ example: '#4F46E5', maxLength: 50 })
  @IsOptional() @IsString() @MaxLength(50)
  declare color?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @IsInt()
  declare orgId?: number;
}
