/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  InvestorGroupTier,
  InvestorStatus,
} from 'src/database/models/projects/investor/investor_model';

export class CreateInvestorNomineeDto {
  @ApiProperty({
    description: 'Nominee full name',
    example: 'Rahim Uddin',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Nominee name is required',
  })
  nomineeName: string;

  @ApiProperty({
    description: 'Nominee NID',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Nominee NID is required',
  })
  nomineeNid: string;

  @ApiProperty({
    description: 'Relation with investor',
    example: 'Brother',
  })
  @IsString()
  @IsNotEmpty({ message: 'Relation is required' })
  relation: string;

  @ApiProperty({
    description: 'Percentage share (0-100)',
    example: 50.0,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  percentage: number;
}

export class CreateInvestorDto {
  @ApiProperty({
    description: 'Unique investor code',
    example: 'INV-2026-001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Investor code is required',
  })
  code: string;

  @ApiProperty({
    description: 'Investor name',
    example: 'Hasibul Islam',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Investor name is required',
  })
  name: string;

  @ApiProperty({
    description: 'Mobile number',
    example: '01712345678',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Mobile number is required',
  })
  mobileNo: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'investor@example.com',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  email?: string;

  @ApiProperty({
    description: 'NID number',
    example: '1234567890123',
  })
  @IsString()
  @IsNotEmpty({ message: 'NID is required' })
  nid: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: 'Dhaka, Bangladesh',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  address?: string;

  @ApiPropertyOptional({
    description: 'Image URL / path',
    example: 'uploads/investors/abc.jpg',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  image?: string;

  @ApiProperty({
    description: 'Group tier',
    enum: InvestorGroupTier,
    example: InvestorGroupTier.TIER_1,
  })
  @IsEnum(InvestorGroupTier)
  @IsNotEmpty({
    message: 'Group tier is required',
  })
  groupTier: InvestorGroupTier;

  @ApiPropertyOptional({
    description: 'Under group',
    example: 'Corporate',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  underGroup?: string;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;

  @ApiPropertyOptional({
    description: 'Status',
    enum: InvestorStatus,
    default: InvestorStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(InvestorStatus)
  status?: InvestorStatus;

  @ApiPropertyOptional({
    description: 'List of nominees',
    type: [CreateInvestorNomineeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvestorNomineeDto)
  nominees?: CreateInvestorNomineeDto[];
}
