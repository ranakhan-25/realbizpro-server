import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskTypeDto {
  @ApiProperty({ example: 'Meeting', maxLength: 255 })
  @IsString() @IsNotEmpty() @MaxLength(255)
  declare name: string;

  @ApiPropertyOptional({ example: 'MEETING', maxLength: 255 })
  @IsOptional() @IsString() @MaxLength(255)
  declare code?: string;

  @ApiPropertyOptional({ enum: ['Active', 'Inactive'], default: 'Active' })
  @IsOptional() @IsIn(['Active', 'Inactive'])
  declare status?: 'Active' | 'Inactive';

  @ApiPropertyOptional({ type: Number, description: 'Organization ID' })
  @IsOptional()
  declare orgId?: number;
}
