import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProfessionDto {
  @ApiProperty({ example: 'Lawyer', maxLength: 150 })
  @IsString() @IsNotEmpty() @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active' })
  @IsOptional() @IsString() @IsIn(['active', 'inactive'])
  declare status?: string;

  @ApiPropertyOptional({ description: 'Profession description' })
  @IsOptional() @IsString()
  declare description?: string;

  @ApiPropertyOptional({ description: 'UUID or display name of the user adding this profession' })
  @IsOptional() @IsString()
  declare createdBy?: string;

  @ApiPropertyOptional({ description: 'Existing project identifier, if applicable' })
  @IsOptional() @IsString()
  declare projectId?: string;

  @ApiPropertyOptional({ type: Number, description: 'Organization ID' })
  @IsOptional()
  declare orgId?: number;
}
