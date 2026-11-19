import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CustomerProfileStatus } from 'src/database/models/customer-service/cs_customer_profile.model';

export class CreateCustomerProfileDto {
  @ApiProperty({
    description: 'Customer full name',
    example: 'Mohammad Rafiqul Islam',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  customer_name: string;

  @ApiProperty({
    description: 'Primary contact phone number',
    example: '+880 1711-234567',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phone_number: string;

  @ApiProperty({
    description: 'National ID (NID) number',
    example: '19842691234567890',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nid_number: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'rafiq.islam@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({
    description: 'e-TIN reference number',
    example: '5421980312',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tin_number?: string;

  @ApiPropertyOptional({
    description: 'Mailing address',
    example:
      'House 42, Road 11, Banani, Dhaka-1213',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Nominee full name',
    example: 'Farzana Yasmin',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nominee_name?: string;

  @ApiPropertyOptional({
    description: 'Relationship with nominee',
    example: 'Spouse',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nominee_relation?: string;

  @ApiPropertyOptional({
    description:
      'Nominee NID or Birth Certificate number',
    example: '19882699876543210',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nominee_nid?: string;

  @ApiPropertyOptional({
    enum: CustomerProfileStatus,
    description: 'Customer status',
    default: CustomerProfileStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(CustomerProfileStatus)
  customer_status?: CustomerProfileStatus;

  @ApiPropertyOptional({
    description: 'Project UUID reference',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Project UUID reference (camelCase alias)',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({
    description:
      'Optional CRM Party ID reference',
  })
  @IsOptional()
  @IsInt()
  party_id?: number;

  @ApiPropertyOptional({
    description:
      'Optional Customer Account ID reference',
  })
  @IsOptional()
  @IsInt()
  customer_account_id?: number;
}
