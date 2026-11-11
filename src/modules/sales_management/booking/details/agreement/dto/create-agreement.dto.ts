/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsBoolean, IsISO8601 } from 'class-validator';

export class CreateAgreementDto {
  @IsISO8601({ strict: true })
  @IsOptional()
  agreementDate?: string;

  @IsBoolean()
  @IsOptional()
  signedByBuyer?: boolean;

  @IsBoolean()
  @IsOptional()
  signedBySeller?: boolean;

  @IsString()
  @IsOptional()
  documentUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}