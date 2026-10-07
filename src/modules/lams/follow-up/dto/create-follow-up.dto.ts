import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateFollowUpDto {
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @IsDateString()
  @IsOptional()
  follow_up_date?: string;

  @IsString()
  @IsOptional()
  follow_up_type?: string;

  @IsString()
  @IsOptional()
  outcome?: string;

  @IsDateString()
  @IsOptional()
  next_action_date?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
