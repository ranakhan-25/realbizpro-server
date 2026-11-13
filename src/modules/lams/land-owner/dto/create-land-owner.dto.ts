import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLandOwnerDto {
  @ApiProperty({ description: 'Mandatory tenant organization identifier', example: 'org-001' })
  @IsString()
  @IsNotEmpty()
  org_id: string;

  @ApiPropertyOptional({ description: 'Optional UUID of associated acquisition lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  lead_id?: string;

  @ApiProperty({ description: 'Owner or Broker', example: 'Owner' })
  @IsString()
  @IsNotEmpty()
  owner_type: string;

  @ApiProperty({ description: 'Full name of the owner/broker', example: 'Alhaj Mofizur Rahman' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Father or Spouse name', example: 'Late Nurul Islam' })
  @IsString()
  @IsOptional()
  father_name?: string;

  @ApiPropertyOptional({ description: 'Contact phone number', example: '01711223344' })
  @IsString()
  @IsOptional()
  contact_number?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'mofiz@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Physical residential address', example: 'House 14, Road 5, Uttara' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'National ID number (10 to 17 digits)', example: '1987261928374' })
  @IsString()
  @IsOptional()
  nid_number?: string;

  @ApiPropertyOptional({ description: 'Percentage of ownership', example: 100.0 })
  @IsNumber()
  @IsOptional()
  ownership_percentage?: number;

  @ApiPropertyOptional({ description: 'Disbursement bank name', example: 'Dutch Bangla Bank Ltd' })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiPropertyOptional({ description: 'Bank account number', example: '120.151.84920' })
  @IsString()
  @IsOptional()
  bank_account?: string;

  @ApiPropertyOptional({ description: 'Array of nominee records with name, relation, nid, and phone' })
  @IsOptional()
  nominee_json?: any;
}
