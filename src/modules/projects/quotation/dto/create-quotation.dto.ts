import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

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
  @IsString()
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
  @IsString()
  projectId?: string;

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

  @IsOptional()
  @IsString()
  approveStatus?: string;

  @IsOptional()
  @IsString()
  addedBy?: string;

  @IsOptional()
  @IsString()
  addedById?: string;
}