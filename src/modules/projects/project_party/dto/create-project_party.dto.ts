/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNumber,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartyType } from 'src/database/models/projects/project_party/pr_project_party_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProjectPartyDto {
  @IsUUID()
  projectUuid: string;

  @IsString()
  partyCode: string;

  @IsEnum(PartyType)
  partyType: PartyType;

  @IsString()
  partyBusinessName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  equityShare?: number;

  @IsString()
  @IsOptional()
  agreementRef?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}