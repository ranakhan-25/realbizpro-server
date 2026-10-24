import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID, Min, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryWorkOrderMeasurementDto {
  @IsOptional() @IsString() measurement_no?: string;
  @IsOptional() @IsUUID() work_order_id?: string;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value) @IsBoolean() is_billed?: boolean;
  @IsOptional() @IsDateString() date_from?: string;
  @IsOptional() @IsDateString() date_to?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number;
}
