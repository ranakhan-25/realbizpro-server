import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsDateString } from 'class-validator';

export class CreateStockIssueDto {
  @ApiProperty({ description: 'Organization ID', example: 'org-001' })
  @IsString()
  @IsNotEmpty()
  org_id: string;

  @ApiPropertyOptional({ description: 'Generated issue voucher code' })
  @IsString()
  @IsOptional()
  issue_code?: string;

  @ApiProperty({ description: 'Source Warehouse ID' })
  @IsNumber()
  @IsNotEmpty()
  warehouse_id: number;

  @ApiProperty({ description: 'Inventory Item UUID' })
  @IsUUID()
  @IsNotEmpty()
  item_id: string;

  @ApiProperty({ default: 0, description: 'Quantity issued' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({ description: 'Issued to person / contractor / project site' })
  @IsString()
  @IsOptional()
  issued_to?: string;

  @ApiPropertyOptional({ description: 'Reference type (project, work_order, maintenance)' })
  @IsString()
  @IsOptional()
  ref_type?: string;

  @ApiPropertyOptional({ description: 'Reference ID or code' })
  @IsString()
  @IsOptional()
  ref_id?: string;

  @ApiPropertyOptional({ description: 'Transaction photo / challan URL' })
  @IsString()
  @IsOptional()
  photo_url?: string;

  @ApiPropertyOptional({ description: 'Date of issue (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiPropertyOptional({ description: 'Notes or issue remarks' })
  @IsString()
  @IsOptional()
  notes?: string;
}
