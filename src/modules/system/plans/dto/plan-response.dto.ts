import { ApiProperty } from '@nestjs/swagger';
import { PlanBillingCycle, PlanStatus } from '@/database/models/system/sys_plan.model';

export class PlanResponseDto {
  @ApiProperty({ example: 1, description: 'Primary numeric ID' })
  id: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Universal Unique Identifier' })
  uuid: string;

  @ApiProperty({ example: 'Enterprise Pro', description: 'Plan name' })
  name: string;

  @ApiProperty({ example: 'PLAN_ENTERPRISE_PRO', description: 'Plan machine code' })
  code: string;

  @ApiProperty({ example: 'Full real-estate management suite with unlimited projects', nullable: true })
  description?: string;

  @ApiProperty({ example: 99.0, description: 'Monthly rate' })
  monthlyPrice: number;

  @ApiProperty({ example: 990.0, description: 'Yearly rate' })
  yearlyPrice: number;

  @ApiProperty({ example: '$', description: 'Currency symbol or code (e.g. $, ৳, €, USD)' })
  currency?: string;

  @ApiProperty({ enum: PlanBillingCycle, example: PlanBillingCycle.MONTHLY })
  billingCycle: PlanBillingCycle;

  @ApiProperty({ example: 30, description: 'Duration in days' })
  durationDays: number;

  @ApiProperty({ example: 14, description: 'Free trial duration' })
  trialDays: number;

  @ApiProperty({ example: 50, description: 'Max allowed user accounts' })
  maxUsers: number;

  @ApiProperty({ example: 25, description: 'Max allowed projects' })
  maxProjects: number;

  @ApiProperty({ example: 51200, description: 'Max storage quota in MB' })
  maxStorageMb: number;

  @ApiProperty({ example: ['CRM_LEADS', 'CRM_CALL_CENTER', 'PROJECT_MASTER'], description: 'Entitled features' })
  features?: any;

  @ApiProperty({ enum: PlanStatus, example: PlanStatus.ACTIVE })
  status: PlanStatus;

  @ApiProperty({ example: 12, description: 'Current active subscriber organizations' })
  subscribersCount: number;

  @ApiProperty({ example: '2026-10-24T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-24T12:00:00.000Z' })
  updatedAt: Date;
}
