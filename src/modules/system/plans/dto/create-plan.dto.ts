import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PlanBillingCycle, PlanStatus } from '@/database/models/system/sys_plan.model';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Human readable display name of the subscription plan',
    example: 'Enterprise Pro',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique identifier code for the plan',
    example: 'PLAN_ENTERPRISE_PRO',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the plan benefits and tier',
    example: 'Full real-estate management suite with unlimited projects and VIP support',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Monthly price in base currency (BDT/USD)',
    example: 99.0,
  })
  @IsNumber()
  @Min(0)
  monthlyPrice: number;

  @ApiProperty({
    description: 'Yearly discounted price in base currency',
    example: 990.0,
  })
  @IsNumber()
  @Min(0)
  yearlyPrice: number;

  @ApiPropertyOptional({
    description: 'Currency symbol or code (e.g. $, ৳, €, USD)',
    example: '$',
    default: '$',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Billing cycle interval',
    enum: PlanBillingCycle,
    example: PlanBillingCycle.MONTHLY,
  })
  @IsEnum(PlanBillingCycle)
  billingCycle: PlanBillingCycle;

  @ApiProperty({
    description: 'Package validity duration in days',
    example: 30,
  })
  @IsInt()
  @Min(1)
  durationDays: number;

  @ApiProperty({
    description: 'Free trial days granted upon onboarding',
    example: 14,
  })
  @IsInt()
  @Min(0)
  trialDays: number;

  @ApiProperty({
    description: 'Maximum user accounts the organization is licensed to create',
    example: 50,
  })
  @IsInt()
  @Min(1)
  maxUsers: number;

  @ApiProperty({
    description: 'Maximum concurrent active projects allowed',
    example: 25,
  })
  @IsInt()
  @Min(1)
  maxProjects: number;

  @ApiProperty({
    description: 'Storage quota limit in Megabytes (e.g. 51200 = 50 GB)',
    example: 51200,
  })
  @IsInt()
  @Min(100)
  maxStorageMb: number;

  @ApiPropertyOptional({
    description: 'List of feature codes included with this plan',
    example: ['CRM_LEADS', 'CRM_CALL_CENTER', 'PROJECT_MASTER', 'PROCUREMENT_BOQ'],
  })
  @IsOptional()
  features?: any;

  @ApiPropertyOptional({
    description: 'Status of the plan',
    enum: PlanStatus,
    example: PlanStatus.ACTIVE,
  })
  @IsEnum(PlanStatus)
  @IsOptional()
  status?: PlanStatus;
}
