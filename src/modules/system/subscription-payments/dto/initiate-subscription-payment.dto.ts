import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum PaymentBillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly',
}

export class InitiateSubscriptionPaymentDto {
  @ApiProperty({ description: 'ID of the target subscription plan in sys_plans' })
  @IsNotEmpty()
  planId: number | string;

  @ApiProperty({
    enum: PaymentBillingCycle,
    default: PaymentBillingCycle.MONTHLY,
    description: 'Billing cycle to purchase (monthly, quarterly, half_yearly, yearly)',
  })
  @IsEnum(PaymentBillingCycle)
  billingCycle: PaymentBillingCycle;

  @ApiPropertyOptional({
    description: 'Organization ID if initiated by Super Admin for a specific tenant',
  })
  @IsOptional()
  organizationId?: number | string;
}
