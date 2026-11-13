import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAcquisitionLeadDto {
  @ApiProperty({ description: 'Title of the acquisition lead', example: 'Uttara Sector 18 Commercial Plot' })
  @IsString()
  @IsNotEmpty()
  lead_title: string;

  @ApiProperty({ description: 'Mandatory tenant organization identifier', example: 'org-001' })
  @IsString()
  @IsNotEmpty()
  org_id: string;

  @ApiPropertyOptional({ description: 'Lead code identifier', example: 'LAD-2026-001' })
  @IsString()
  @IsOptional()
  lead_code?: string;

  @ApiPropertyOptional({ description: 'Date of the lead', example: '2026-10-07' })
  @IsDateString()
  @IsOptional()
  lead_date?: string;

  @ApiPropertyOptional({ description: 'Type of land', example: 'Commercial' })
  @IsString()
  @IsOptional()
  land_type?: string;

  @ApiPropertyOptional({ description: 'Area of the land in decimals/kathas', example: 5.5 })
  @IsNumber()
  @IsOptional()
  land_area?: number;

  @ApiPropertyOptional({ description: 'Area of land in Katha', example: 15.5 })
  @IsNumber()
  @IsOptional()
  area_katha?: number;

  @ApiPropertyOptional({ description: 'Area of land in Sqft', example: 11160 })
  @IsNumber()
  @IsOptional()
  area_sqft?: number;

  @ApiPropertyOptional({ description: 'Street or area location address', example: 'Uttara Sector 18, Dhaka' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Mouza name', example: 'Badda' })
  @IsString()
  @IsOptional()
  mouza?: string;

  @ApiPropertyOptional({ description: 'Khatian number', example: 'CS 102, RS 504' })
  @IsString()
  @IsOptional()
  khatian_no?: string;

  @ApiPropertyOptional({ description: 'Dag / Plot number', example: 'Dag 889' })
  @IsString()
  @IsOptional()
  dag_no?: string;

  @ApiPropertyOptional({ description: 'Asking price in BDT', example: 50000000 })
  @IsNumber()
  @IsOptional()
  asking_price?: number;

  @ApiPropertyOptional({ description: 'Sourcing channel', example: 'Direct Owner' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Priority level', example: 'High' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ description: 'Status of the lead', example: 'Draft' })
  @IsString()
  @IsOptional()
  lead_status?: string;

  @ApiPropertyOptional({ description: 'Assigned officer username or name', example: 'Sakib Al Hasan' })
  @IsString()
  @IsOptional()
  assigned_to?: string;

  @ApiPropertyOptional({ description: 'Notes and observations', example: 'Prime corner plot near metro station' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'JSON structure of co owners' })
  @IsOptional()
  co_owners_json?: any;

  @ApiPropertyOptional({ description: 'Google map or GIS link', example: 'https://maps.google.com/?q=23.87,90.38' })
  @IsString()
  @IsOptional()
  map_url?: string;

  // Inline landowner details supported during lead wizard creation
  @ApiPropertyOptional({ description: 'Existing owner UUID if linking', example: 'owner-uuid' })
  @IsString()
  @IsOptional()
  owner_id?: string;

  @ApiPropertyOptional({ description: 'Owner name if creating inline', example: 'Abdul Malek' })
  @IsString()
  @IsOptional()
  owner_name?: string;

  @ApiPropertyOptional({ description: 'Owner phone if creating inline', example: '01711223344' })
  @IsString()
  @IsOptional()
  owner_phone?: string;

  @ApiPropertyOptional({ description: 'Owner NID if creating inline', example: '1987261928374' })
  @IsString()
  @IsOptional()
  owner_nid?: string;
}
