/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsOptional, IsISO8601, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommissionDto {
  @IsString() commissionId: string;
  @IsString() @IsOptional() status?: string;

  @IsNumber() @Min(0) @Type(() => Number) dealValue: number;
  @IsNumber() @Min(0) @Type(() => Number) commissionRate: number;
  @IsNumber() @Min(0) @Type(() => Number) grossCommission: number;
  @IsNumber() @Min(0) @Type(() => Number) deductions: number;
  @IsNumber() @Min(0) @Type(() => Number) netCommission: number;

  @IsISO8601({ strict: true }) @IsOptional() paidDate?: string;
  @IsString() @IsOptional() txnId?: string;

  // Agent Snapshot
  @IsString() agentName: string;
  @IsString() @IsOptional() agentRole?: string;
  @IsString() @IsOptional() agentAvatar?: string;
}