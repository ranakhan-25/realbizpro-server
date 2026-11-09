/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNumberString,
  IsIn
} from 'class-validator';
import { PartyType } from 'src/database/models/projects/project_party/pr_project_party_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryProjectPartyDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsEnum(PartyType)
  @IsOptional()
  partyType?: PartyType;

  @IsString()
  @IsOptional()
  search?: string;

  // ✅ sortBy এবং sortOrder যোগ করা হলো (এরর সমাধানের জন্য)
  @IsIn(['partyCode', 'partyBusinessName', 'partyType', 'equityShare', 'createdAt'])
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Filter by project ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}