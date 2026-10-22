import {
  Allow,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class WorkOrderDto {
  @IsString()
  @IsNotEmpty()
  declare title: string;

  @IsDateString({ strict: true })
  @IsNotEmpty()
  declare date: string;

  @IsOptional()
  @IsDateString({ strict: true })
  declare recordDate?: string;

  @IsString()
  @IsNotEmpty()
  declare code: string;

  @IsOptional()
  @IsUUID()
  declare customerId?: string;

  @IsOptional()
  @IsString()
  declare clientOrderNo?: string;

  @IsOptional()
  @IsUUID()
  declare projectTypeId?: string;

  @IsUUID()
  @IsNotEmpty()
  declare projectId: string;

  @IsOptional()
  @IsUUID()
  declare siteId?: string;

  @IsOptional()
  @IsString()
  declare attachment?: string;

  @IsOptional()
  @IsString()
  declare poNo?: string;

  @IsOptional()
  @IsUUID()
  declare categoryId?: string;

  @IsOptional()
  @IsUUID()
  declare subCategoryId?: string;

  @IsArray()
  declare items: Array<Record<string, unknown>>;

  @IsNumber()
  declare subtotal: number;

  @IsNumber()
  declare vatPercent: number;

  @IsBoolean()
  declare vatInclude: boolean;

  @IsNumber()
  declare vatAmount: number;

  @IsNumber()
  declare aitPercent: number;

  @IsBoolean()
  declare aitInclude: boolean;

  @IsNumber()
  declare aitAmount: number;

  @IsNumber()
  declare grandTotal: number;

  @IsOptional()
  @IsNumber()
  declare amount: number;

  @IsObject()
  declare details: Record<string, unknown>;
}
