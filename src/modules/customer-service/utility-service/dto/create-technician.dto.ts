import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TechnicianSpecialtyEnum {
  PLUMBER = 'Plumber',
  ELECTRICIAN = 'Electrician',
  SANITARY = 'Sanitary Specialist',
  HVAC = 'HVAC / Generator',
  MULTI = 'Multi-skilled',
}

export enum TechnicianTypeEnum {
  IN_HOUSE = 'In-house',
  VENDOR = 'Vendor',
}

export class CreateTechnicianDto {
  @ApiPropertyOptional({
    description: 'Project UUID to optionally bind technician to a specific project',
  })
  @IsOptional()
  @IsUUID('4')
  project_id?: string;

  @ApiProperty({ description: 'Technician full name', example: 'Md. Monir Hossain' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ description: 'Technician contact phone number', example: '+8801712345678' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phone: string;

  @ApiProperty({
    description: 'Technician primary specialty',
    enum: TechnicianSpecialtyEnum,
    example: TechnicianSpecialtyEnum.PLUMBER,
  })
  @IsNotEmpty()
  @IsEnum(TechnicianSpecialtyEnum)
  specialty: TechnicianSpecialtyEnum;

  @ApiPropertyOptional({
    description: 'Employment type: In-house or Vendor',
    enum: TechnicianTypeEnum,
    default: TechnicianTypeEnum.IN_HOUSE,
  })
  @IsOptional()
  @IsEnum(TechnicianTypeEnum)
  technician_type?: TechnicianTypeEnum;

  @ApiPropertyOptional({
    description: 'Third-party vendor agency name if technician is external',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  vendor_name?: string;

  @ApiPropertyOptional({ description: 'Active dispatch status', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

