import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CrmPartyStatus, CrmPartyType } from 'src/database/models/crm/lead/crm-party.model';

export class QueryCrmPartyDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;
  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
  @ApiPropertyOptional({ description: 'Search by name, phone, email, or NID' }) @IsOptional() @IsString() declare search?: string;
  @ApiPropertyOptional({ description: 'Filter by organization ID' }) @IsOptional() @Type(() => Number) @IsInt() declare orgId?: number;
  @ApiPropertyOptional({ enum: CrmPartyType }) @IsOptional() @IsEnum(CrmPartyType) declare partyType?: CrmPartyType;
  @ApiPropertyOptional({ enum: CrmPartyStatus }) @IsOptional() @IsEnum(CrmPartyStatus) declare status?: CrmPartyStatus;
}
