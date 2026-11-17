import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Warehouse unique code (e.g. WH-01, CEN-WH)' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Warehouse display name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Physical address / site location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ default: 'central', description: 'Warehouse type (central, site, transit)' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ default: true, description: 'Is warehouse active' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ description: 'Organization ID', example: 'org-001' })
  @IsString()
  @IsNotEmpty()
  org_id: string;
}
