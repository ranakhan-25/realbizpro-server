import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRequirementTypeDto {
  @ApiProperty({ example: 'Used', maxLength: 150 })
  @IsString() @IsNotEmpty() @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ type: Number, description: 'Organization ID' })
  @IsOptional() @Type(() => Number) @IsInt()
  declare orgId?: number;
}
