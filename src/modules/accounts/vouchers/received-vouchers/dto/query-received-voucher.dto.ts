import { Type } from 'class-transformer';
import { 
  IsOptional, 
  IsString, 
  IsNumber, 
  IsDateString, 
  Min 
} from 'class-validator';

export class GetVouchersQueryDto {
  // ================= Pagination =================
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  // ================= Search & Filters (Screenshot Table) =================
  @IsOptional()
  @IsString()
  search?: string; // Voucher No ba Code search korar jonno

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  workId?: string;

  @IsOptional()
  @IsString()
  siteId?: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsString()
  creditAccountId?: string;

  @IsOptional()
  @IsString()
  debitAccountId?: string;

  // ================= Date Range (Select Date) =================
  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO 8601 date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  endDate?: string;

  @IsOptional()
  @IsString()
  status?: string; // Draft, Pending, Approved, etc.
}