// src/modules/system/dto/create-company.dto.ts
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'EasySofts Ltd.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'House 10, Road 5, Mirpur',
  })
  @IsString()
  @IsOptional()
  address?: string;

  //bnname optional
  @ApiPropertyOptional({
    example: 'ইজি সফটস লিমিটেড',
  })
  @IsString()
  @IsOptional()
  bnName?: string;

  //bn address
  @ApiPropertyOptional({
    example: 'বাড়ি ১০, রাস্তা ৫, মিরপুর',
  })
  @IsString()
  @IsOptional()
  bnAddress?: string;

  @ApiPropertyOptional({
    example: '+8801712345678',
  })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiPropertyOptional({
    example: '+8802-1234567',
  })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiPropertyOptional({
    example: '192.168.0.10',
  })
  @IsString()
  @IsOptional()
  ipPhone?: string;

  @ApiPropertyOptional({ example: 'VAT123456' })
  @IsString()
  @IsOptional()
  vatRegNum?: string;

  @ApiPropertyOptional({
    example: 'info@easysofts.com',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'https://easysofts.com',
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ example: 'Active' })
  @IsString()
  @IsOptional()
  status?: 'Active' | 'Inactive';
}
