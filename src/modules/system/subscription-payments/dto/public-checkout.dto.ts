import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PaymentBillingCycle } from './initiate-subscription-payment.dto';

export class PublicCheckoutDto {
  @ApiProperty({ example: 1, description: 'ID or UUID of selected plan' })
  @IsNotEmpty()
  planId: number | string;

  @ApiPropertyOptional({
    enum: PaymentBillingCycle,
    default: PaymentBillingCycle.MONTHLY,
  })
  @IsOptional()
  @IsEnum(PaymentBillingCycle)
  billingCycle?: PaymentBillingCycle = PaymentBillingCycle.MONTHLY;

  @ApiProperty({ example: 'Acme Developers Ltd.', description: 'Company or Organization Name' })
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiPropertyOptional({ example: 'ORG_ACME', description: 'Unique tenant short code (auto-generated if omitted)' })
  @IsString()
  @IsOptional()
  organizationCode?: string;

  @ApiProperty({ example: 'John Doe', description: 'Primary administrator full name' })
  @IsString()
  @IsNotEmpty()
  adminName: string;

  @ApiProperty({ example: 'admin@acmedev.com', description: 'Administrator email' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @IsNotEmpty()
  adminEmail: string;

  @ApiPropertyOptional({ example: 'johndoe', description: 'Login username (defaults to email username if omitted)' })
  @IsString()
  @IsOptional()
  adminUsername?: string;

  @ApiProperty({ example: 'SecretP@ss123', minLength: 6, description: 'Login password' })
  @IsString()
  @MinLength(6)
  adminPassword: string;

  @ApiPropertyOptional({ example: '01700000000' })
  @IsString()
  @IsOptional()
  adminPhone?: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsString()
  @IsOptional()
  organizationAddress?: string;
}
