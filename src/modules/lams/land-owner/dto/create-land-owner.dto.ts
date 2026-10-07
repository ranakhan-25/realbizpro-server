import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateLandOwnerDto {
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @IsString()
  @IsNotEmpty()
  owner_type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  contact_number?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  nid_number?: string;

  @IsNumber()
  @IsOptional()
  ownership_percentage?: number;
}
