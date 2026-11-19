import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum NoticeStageEnum {
  FIRST_REMINDER = '1st Reminder',
  SECOND_NOTICE = '2nd Notice',
  FINAL_STATUTORY_NOTICE = 'Final Statutory Notice',
}

export class IssueNoticeDto {
  @ApiPropertyOptional({
    description: 'Notice Stage to issue',
    enum: NoticeStageEnum,
    default: NoticeStageEnum.FIRST_REMINDER,
  })
  @IsOptional()
  @IsString()
  notice_stage?: string;

  @ApiPropertyOptional({
    description: 'Remedy cure period in days (statutory default is 30 days per Real Estate Act 2010 Section 14)',
    default: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(7)
  remedy_period_days?: number = 30;

  @ApiPropertyOptional({
    description: 'Official notes or legal remarks',
  })
  @IsOptional()
  @IsString()
  officer_notes?: string;

  @ApiPropertyOptional({
    description: 'Dispatch delivery method: Registered Post, Courier, Email & SMS, Physical Delivery',
    default: 'Registered Post',
  })
  @IsOptional()
  @IsString()
  dispatch_method?: string = 'Registered Post';
}
