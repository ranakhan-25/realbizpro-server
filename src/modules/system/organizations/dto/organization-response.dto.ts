import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrgSubscriptionStatus } from '@/database/models/system/sys_organization.model';
import { PlanResponseDto } from '../../plans/dto/plan-response.dto';

export class OrgAdminSummaryDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiPropertyOptional({ example: 'tanvir_apex' })
  username?: string;

  @ApiProperty({ example: 'Tanvir Hossain' })
  name: string;

  @ApiProperty({ example: 'admin@apexholdings.com' })
  email: string;

  @ApiPropertyOptional({ example: '+8801712345678' })
  mobile?: string;
}

export class EntitledFeatureSummaryDto {
  @ApiProperty({ example: 12 })
  featureId: number;

  @ApiProperty({ example: 'CRM_LEAD_TRANSFER' })
  featureCode: string;

  @ApiProperty({ example: 'Transfer Leads' })
  featureName: string;

  @ApiProperty({ example: '/crm/leads/transfers' })
  routePath?: string;
}

export class EntitledModuleSummaryDto {
  @ApiProperty({ example: 2 })
  moduleId: number;

  @ApiProperty({ example: 'CRM' })
  moduleCode: string;

  @ApiProperty({ example: 'CRM & Sales' })
  moduleName: string;

  @ApiProperty({ type: [EntitledFeatureSummaryDto] })
  features: EntitledFeatureSummaryDto[];
}

export class OrganizationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'c2d3e4f5-6789-01bc-def2-345678901234' })
  uuid: string;

  @ApiProperty({ example: 'Apex Holdings Ltd.' })
  name: string;

  @ApiProperty({ example: 'ORG_APEX' })
  code: string;

  @ApiProperty({ example: 'contact@apexholdings.com', nullable: true })
  email?: string;

  @ApiProperty({ example: '+8801711000000', nullable: true })
  phone?: string;

  @ApiProperty({ example: 'Gulshan 2, Dhaka', nullable: true })
  address?: string;

  @ApiProperty({ enum: OrgSubscriptionStatus, example: OrgSubscriptionStatus.ACTIVE })
  subscriptionStatus: OrgSubscriptionStatus;

  @ApiPropertyOptional({ example: '2026-10-24T00:00:00.000Z' })
  subscriptionStartDate?: Date;

  @ApiPropertyOptional({ example: '2026-11-23T23:59:59.000Z' })
  subscriptionEndDate?: Date;

  @ApiPropertyOptional({ example: '2026-11-07T23:59:59.000Z' })
  trialEndsAt?: Date;

  @ApiProperty({ example: 20 })
  maxUsers: number;

  @ApiProperty({ example: 10 })
  maxProjects: number;

  @ApiProperty({ example: 20480 })
  maxStorageMb: number;

  @ApiProperty({ example: false })
  isLocked: boolean;

  @ApiPropertyOptional({ example: null })
  lockReason?: string;

  @ApiProperty({ example: 4, description: 'Number of registered users in this tenant' })
  userCount: number;

  @ApiPropertyOptional({ type: PlanResponseDto })
  plan?: PlanResponseDto;

  @ApiPropertyOptional({ type: OrgAdminSummaryDto })
  adminUser?: OrgAdminSummaryDto;

  @ApiPropertyOptional({ type: [EntitledModuleSummaryDto] })
  entitledModules?: EntitledModuleSummaryDto[];

  @ApiProperty({ example: '2026-10-24T12:00:00.000Z' })
  createdAt: Date;
}
