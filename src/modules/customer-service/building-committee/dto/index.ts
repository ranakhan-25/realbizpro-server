import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  CommitteeDesignation,
  CommitteeMemberStatus,
  CommitteeMemberType,
  DecisionStatus,
} from 'src/database/models/customer-service/cs_committee.types';

// =========================================================================
// 1. COMMITTEE MEMBER DTOs
// =========================================================================

export class CreateCommitteeMemberDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({
    description: 'Member type: Developer Representative or Flat Owner',
    enum: ['DEVELOPER_REP', 'FLAT_OWNER'],
    default: 'FLAT_OWNER',
  })
  @IsIn(['DEVELOPER_REP', 'FLAT_OWNER'])
  member_type: CommitteeMemberType;

  @ApiPropertyOptional({ description: 'Flat number (applicable for FLAT_OWNER)', example: '7A' })
  @IsOptional()
  @IsString()
  flat_number?: string;

  @ApiProperty({ description: 'Member full name', example: 'Engr. Rafiqul Islam' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Designation in committee',
    enum: ['President', 'Secretary', 'Treasurer', 'Member', 'Advisor'],
    default: 'Member',
  })
  @IsIn(['President', 'Secretary', 'Treasurer', 'Member', 'Advisor'])
  designation: CommitteeDesignation;

  @ApiPropertyOptional({ description: 'Specific responsibility / portfolio', example: 'Security & Access Control' })
  @IsOptional()
  @IsString()
  responsibility?: string;

  @ApiProperty({ description: 'Contact phone number', example: '+880 1711-000000' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Term start date YYYY-MM-DD' })
  @IsString()
  term_start: string;

  @ApiPropertyOptional({ description: 'Term end date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  term_end?: string;

  @ApiPropertyOptional({
    description: 'Membership status',
    enum: ['ACTIVE', 'TERM_EXPIRED', 'RESIGNED'],
    default: 'ACTIVE',
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'TERM_EXPIRED', 'RESIGNED'])
  status?: CommitteeMemberStatus;

  @ApiPropertyOptional({ description: 'Notes or bio' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCommitteeMemberDto {
  @ApiPropertyOptional({
    description: 'Member type: Developer Representative or Flat Owner',
    enum: ['DEVELOPER_REP', 'FLAT_OWNER'],
  })
  @IsOptional()
  @IsIn(['DEVELOPER_REP', 'FLAT_OWNER'])
  member_type?: CommitteeMemberType;

  @ApiPropertyOptional({ description: 'Flat number' })
  @IsOptional()
  @IsString()
  flat_number?: string;

  @ApiPropertyOptional({ description: 'Member full name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Designation in committee',
    enum: ['President', 'Secretary', 'Treasurer', 'Member', 'Advisor'],
  })
  @IsOptional()
  @IsIn(['President', 'Secretary', 'Treasurer', 'Member', 'Advisor'])
  designation?: CommitteeDesignation;

  @ApiPropertyOptional({ description: 'Specific responsibility / portfolio' })
  @IsOptional()
  @IsString()
  responsibility?: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Term start date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  term_start?: string;

  @ApiPropertyOptional({ description: 'Term end date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  term_end?: string;

  @ApiPropertyOptional({
    description: 'Membership status',
    enum: ['ACTIVE', 'TERM_EXPIRED', 'RESIGNED'],
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'TERM_EXPIRED', 'RESIGNED'])
  status?: CommitteeMemberStatus;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryCommitteeMemberDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by member type',
    enum: ['DEVELOPER_REP', 'FLAT_OWNER', 'all'],
  })
  @IsOptional()
  @IsString()
  member_type?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ['ACTIVE', 'TERM_EXPIRED', 'RESIGNED', 'all'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Search member name, phone, flat or portfolio' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;
}

// =========================================================================
// 2. COMMITTEE DECISIONS & RESOLUTIONS DTOs
// =========================================================================

export class CreateCommitteeDecisionDto {
  @ApiProperty({ description: 'Project UUID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ description: 'Resolution / Decision title', example: 'Tariff Revision for Swimming Pool Maintenance' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Meeting date YYYY-MM-DD' })
  @IsString()
  meeting_date: string;

  @ApiPropertyOptional({
    description: 'Agenda category',
    example: 'Service Charge',
    default: 'General Body',
  })
  @IsOptional()
  @IsString()
  agenda_category?: string;

  @ApiProperty({ description: 'Resolution notes & action points' })
  @IsString()
  resolution_notes: string;

  @ApiPropertyOptional({
    description: 'Implementation status',
    enum: ['APPROVED', 'IN_PROGRESS', 'IMPLEMENTED'],
    default: 'APPROVED',
  })
  @IsOptional()
  @IsIn(['APPROVED', 'IN_PROGRESS', 'IMPLEMENTED'])
  status?: DecisionStatus;
}

export class UpdateCommitteeDecisionDto {
  @ApiPropertyOptional({ description: 'Resolution / Decision title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Meeting date YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  meeting_date?: string;

  @ApiPropertyOptional({ description: 'Agenda category' })
  @IsOptional()
  @IsString()
  agenda_category?: string;

  @ApiPropertyOptional({ description: 'Resolution notes & action points' })
  @IsOptional()
  @IsString()
  resolution_notes?: string;

  @ApiPropertyOptional({
    description: 'Implementation status',
    enum: ['APPROVED', 'IN_PROGRESS', 'IMPLEMENTED'],
  })
  @IsOptional()
  @IsIn(['APPROVED', 'IN_PROGRESS', 'IMPLEMENTED'])
  status?: DecisionStatus;
}

export class QueryCommitteeDecisionDto {
  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by implementation status',
    enum: ['APPROVED', 'IN_PROGRESS', 'IMPLEMENTED', 'all'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by agenda category' })
  @IsOptional()
  @IsString()
  agenda_category?: string;

  @ApiPropertyOptional({ description: 'Search title or resolution text' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;
}

