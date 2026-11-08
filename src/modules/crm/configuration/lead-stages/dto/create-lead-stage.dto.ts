import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateLeadStageDto {
  @ApiProperty({ example: 'Prospect', maxLength: 150 })
  @IsString() @IsNotEmpty() @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active' })
  @IsOptional() @IsIn(['active', 'inactive'])
  declare status?: 'active' | 'inactive';

  @ApiPropertyOptional({ example: 'Qualified lead at initial contact' })
  @IsOptional() @IsString()
  declare description?: string;

  @ApiPropertyOptional({ type: Number, example: 2, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  declare sortBy?: number;

  @ApiPropertyOptional({ type: Number, example: 40, minimum: 0, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100)
  declare salesProbability?: number;

  @ApiPropertyOptional({ example: '#6C63FF', pattern: '^#([0-9A-Fa-f]{6})$' })
  @IsOptional() @IsString() @Matches(/^#([0-9A-Fa-f]{6})$/)
  declare color?: string;

  @ApiPropertyOptional({ type: Number, description: 'Organization ID' })
  @IsOptional() @Type(() => Number) @IsInt()
  declare orgId?: number;
}
