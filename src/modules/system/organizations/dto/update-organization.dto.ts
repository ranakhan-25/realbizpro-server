import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Apex Holdings Corporation' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'contact@apexcorp.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+8801711223344' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Banani, Dhaka' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsInt()
  @IsOptional()
  maxUsers?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @IsOptional()
  maxProjects?: number;

  @ApiPropertyOptional({ example: 30720 })
  @IsInt()
  @IsOptional()
  maxStorageMb?: number;
}
