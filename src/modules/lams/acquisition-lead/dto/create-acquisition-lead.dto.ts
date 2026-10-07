import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateAcquisitionLeadDto {
  @IsString()
  @IsNotEmpty()
  lead_title: string;

  @IsDateString()
  @IsOptional()
  lead_date?: string;

  @IsString()
  @IsOptional()
  land_type?: string;

  @IsNumber()
  @IsOptional()
  land_area?: number;
}
