import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovementDto {
  @ApiPropertyOptional({ description: 'Tenant organization identifier', example: 'org-001' })
  @IsString()
  @IsOptional()
  org_id?: string;

  @ApiProperty({ description: 'Item UUID', example: 'item-uuid-123' })
  @IsUUID()
  @IsNotEmpty()
  item_id: string;

  @ApiProperty({ description: 'Warehouse ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  warehouse_id: number;

  @ApiPropertyOptional({ description: 'Destination Warehouse ID for transfers', example: 2 })
  @IsNumber()
  @IsOptional()
  to_warehouse_id?: number;

  @ApiProperty({ description: 'Quantity moved', example: 25.5 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({ description: 'Unit cost rate in BDT', example: 540 })
  @IsNumber()
  @IsOptional()
  unit_rate?: number;

  @ApiPropertyOptional({ description: 'Total amount in BDT', example: 13770 })
  @IsNumber()
  @IsOptional()
  total_amount?: number;

  @ApiPropertyOptional({ description: 'Movement date', example: '2026-10-10' })
  @IsDateString()
  @IsOptional()
  movement_date?: string;

  @ApiPropertyOptional({ description: 'Reference type (project, count, requisition)', example: 'project' })
  @IsString()
  @IsOptional()
  reference_type?: string;

  @ApiPropertyOptional({ description: 'Reference identifier or code', example: 'PRJ-1001' })
  @IsString()
  @IsOptional()
  reference_id?: string;

  @ApiPropertyOptional({ description: 'Person or entity issued to or received from', example: 'Engr. Rahman' })
  @IsString()
  @IsOptional()
  issued_to?: string;

  @ApiPropertyOptional({ description: 'Reason for return or adjustment', example: 'Unused foundation concrete' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Additional observation notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Attachment or photo URL' })
  @IsString()
  @IsOptional()
  photo_url?: string;
}
