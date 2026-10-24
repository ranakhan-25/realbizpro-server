import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ProcurementWorkBillStatus } from 'src/database/models/procurement/work-order/pr_work_bill.model';

export class CreateWorkBillDto {
  @IsUUID() measurement_id: string;
}

export class UpdateWorkBillStatusDto {
  @IsEnum(ProcurementWorkBillStatus) status: ProcurementWorkBillStatus;
}

export class QueryWorkBillDto {
  @IsOptional() @IsString() bill_no?: string;
  @IsOptional() @IsEnum(ProcurementWorkBillStatus) status?: ProcurementWorkBillStatus;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number;
}
