import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsDateString } from 'class-validator';

export class CreateNegotiationProcessDto {
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @IsDateString()
  @IsOptional()
  negotiation_date?: string;

  @IsNumber()
  @IsOptional()
  offered_price?: number;

  @IsNumber()
  @IsOptional()
  agreed_price?: number;

  @IsString()
  @IsOptional()
  negotiation_status?: string;

  @IsDateString()
  @IsOptional()
  next_meeting_date?: string;

  @IsString()
  @IsOptional()
  meeting_notes?: string;
}
