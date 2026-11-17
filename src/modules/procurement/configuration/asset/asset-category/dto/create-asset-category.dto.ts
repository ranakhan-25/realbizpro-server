import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProcurementAssetCategoryDto {
  @ApiPropertyOptional({ example: 'Asset', default: 'Asset' })
  @IsOptional() @IsString() @MaxLength(50)
  type?: string;

  @ApiProperty({ example: 'AC-001' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  code: string;

  @ApiProperty({ example: 'Vehicle' })
  @IsString() @IsNotEmpty() @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional() @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  projectId?: string;

}
