import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { OrgSubscriptionStatus } from '@/database/models/system/sys_organization.model';

export enum SubscriptionAction {
  RENEW = 'renew',
  EXTEND = 'extend',
  CHANGE_PLAN = 'change_plan',
  CANCEL = 'cancel',
}

export class UpdateSubscriptionDto {
  @ApiProperty({
    enum: SubscriptionAction,
    example: SubscriptionAction.RENEW,
    description: 'Lifecycle action to perform on tenant subscription',
  })
  @IsEnum(SubscriptionAction)
  @IsNotEmpty()
  action: SubscriptionAction;

  @ApiPropertyOptional({ example: 1, description: 'New SysPlan ID if upgrading/downgrading' })
  @IsOptional()
  planId?: number | string;

  @ApiPropertyOptional({ example: 30, description: 'Days to extend or renew' })
  @IsInt()
  @Min(1)
  @IsOptional()
  durationDays?: number;

  @ApiPropertyOptional({ example: '2027-10-24T00:00:00.000Z', description: 'Explicit new expiration date' })
  @IsDateString()
  @IsOptional()
  subscriptionEndDate?: string;

  @ApiPropertyOptional({ enum: OrgSubscriptionStatus, example: OrgSubscriptionStatus.ACTIVE })
  @IsEnum(OrgSubscriptionStatus)
  @IsOptional()
  status?: OrgSubscriptionStatus;
}
