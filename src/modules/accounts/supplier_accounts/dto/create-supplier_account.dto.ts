import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsDateString,
  IsInt,
  Length,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupplierAccountDto {
  @ApiProperty({ example: 'SUP1889198', description: 'Unique supplier code' })
  @IsString()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Riva Steel Mils' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({ example: 'Riva Steel Mils Ltd.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  businessOrganization?: string;

  @ApiPropertyOptional({ example: 'supplier@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: '01312345695' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneMobile?: string;

  @ApiPropertyOptional({ example: 'Motijheel, Dhaka' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 50000, description: 'Credit limit amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 'Sundry Creditors' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  under?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'CustomerAccount id this supplier belongs to',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customerAccountId?: number;
}