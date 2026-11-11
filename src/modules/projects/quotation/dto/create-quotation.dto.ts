import {
  IsArray,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QuotationItemDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  unit: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rate: number;

  @IsString()
  details: string;

  @IsString()
  image: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreateQuotationDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @IsOptional()
  @IsString()
  site?: string;

  @IsOptional()
  @IsString()
  attachment?: string;

  @IsOptional()
  @IsString()
  contentBody?: string;

  @IsOptional()
  @IsString()
  employeeName?: string;

  @IsOptional()
  @IsNumber()
  grandTotal?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationItemDto)
  items: QuotationItemDto[] = [];

  @IsOptional()
  @IsString()
  approveStatus?: string;

  @IsOptional()
  @IsString()
  addedBy?: string;

  @IsOptional()
  @IsString()
  addedById?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}