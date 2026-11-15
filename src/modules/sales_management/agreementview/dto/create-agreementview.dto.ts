import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AgreementStatus, PropertyType } from '../../../../database/models/sales_management/sm_agreement_view.model';


export class CreateAgreementDto {
  @ApiProperty({ example: 'AGR-2024-001', description: 'Unique agreement code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  agreementCode: string;

  @ApiProperty({ example: 'Ayesha Rahman' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  buyer: string;

  @ApiPropertyOptional({ example: 'https://i.pravatar.cc/150?img=5' })
  @IsOptional()
  @IsUrl()
  buyerAvatar?: string;

  @ApiProperty({ example: 'Gulshan Plot 12/A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  property: string;

  @ApiProperty({ example: 'GUL-PLT-012' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  propertyCode: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.RESIDENTIAL_LAND })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 12000000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ example: 2400000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  advance: number;

  @ApiProperty({ example: '2024-01-15', description: 'YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ enum: AgreementStatus, example: AgreementStatus.DRAFT })
  @IsOptional()
  @IsEnum(AgreementStatus)
  status?: AgreementStatus;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'ayesha@example.com' })
  @IsOptional()
  @IsString()
  buyerEmail?: string;

  @ApiPropertyOptional({ example: '+8801700000000' })
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiPropertyOptional({ example: 'Handover on 2024-06-01' })
  @IsOptional()
  @IsString()
  notes?: string;
}
