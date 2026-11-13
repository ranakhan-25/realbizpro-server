import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateStockCountDto {
  @ApiProperty({ description: 'Organization ID', example: 'org-001' })
  @IsString()
  @IsNotEmpty()
  org_id: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @IsNumber()
  @IsNotEmpty()
  warehouse_id: number;

  @ApiPropertyOptional({ description: 'Date of count (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  counted_at?: Date;

  @ApiPropertyOptional({ default: 'draft', description: 'Count status (draft, completed, verified)' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Notes or remarks' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ description: 'Inventory count items lines JSON' })
  @IsOptional()
  lines_json?: any;
}
