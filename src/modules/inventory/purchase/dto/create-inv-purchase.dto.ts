import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvPurchaseItemDto } from './create-inv-purchase-item.dto';

export class CreateInvPurchaseDto {
  @ApiProperty({ description: 'Date of purchase', example: '2026-10-08' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ description: 'Payment Method', example: 'Cash' })
  @IsString()
  @IsOptional()
  payment_method?: string;

  @ApiProperty({ description: 'Subtotal before discount/delivery', example: 5000 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ description: 'Discount applied', example: 100 })
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty({ description: 'Delivery charge', example: 50 })
  @IsNumber()
  @Min(0)
  delivery_charge: number;

  @ApiProperty({ description: 'Grand total after discount & delivery', example: 4950 })
  @IsNumber()
  @Min(0)
  grand_total: number;

  @ApiProperty({ description: 'Paid amount', example: 2000 })
  @IsNumber()
  @Min(0)
  paid_amount: number;

  @ApiProperty({ description: 'Due amount', example: 2950 })
  @IsNumber()
  @Min(0)
  due_amount: number;

  @ApiPropertyOptional({ description: 'Cheque Number', example: 'CHQ-12345' })
  @IsString()
  @IsOptional()
  cheque_no?: string;

  @ApiPropertyOptional({ description: 'Cheque Date', example: '2026-10-15' })
  @IsDateString()
  @IsOptional()
  cheque_date?: string;

  @ApiProperty({ description: 'Supplier UUID', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  supplier_id: string;

  @ApiPropertyOptional({ description: 'Project Type ID', example: 'uuid' })
  @IsString()
  @IsOptional()
  project_type_id?: string;

  @ApiPropertyOptional({ description: 'Project ID', example: 'uuid' })
  @IsString()
  @IsOptional()
  project_id?: string;

  @ApiPropertyOptional({ description: 'BOQ Title ID', example: 'uuid' })
  @IsString()
  @IsOptional()
  boq_title_id?: string;

  @ApiPropertyOptional({ description: 'Task ID', example: 'uuid' })
  @IsString()
  @IsOptional()
  task_id?: string;

  @ApiPropertyOptional({ description: 'Site ID', example: 'uuid' })
  @IsString()
  @IsOptional()
  site_id?: string;

  @ApiProperty({ type: [CreateInvPurchaseItemDto], description: 'List of items in the purchase' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvPurchaseItemDto)
  items: CreateInvPurchaseItemDto[];

  @ApiPropertyOptional({ example: 'uuid', description: 'Created By ID' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Updated By ID' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Deleted By ID' })
  @IsOptional()
  @IsString()
  deletedBy?: string;
}
