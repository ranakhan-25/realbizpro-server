import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFollowUpActivityDto {
  @ApiProperty({ example: 'followup', enum: ['followup', 'task_visit', 'visit', 'note'] }) @IsIn(['followup', 'task_visit', 'visit', 'note']) declare activityType: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() declare activityDate?: string;
  @ApiProperty({ description: 'Call or visit notes; persisted in activity summary' }) @IsString() declare comment: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare feedback?: string;
  @ApiPropertyOptional({ description: 'Configured communication status UUID or label' }) @IsOptional() @IsString() declare communicationStatus?: string;
  @ApiPropertyOptional({ description: 'Next follow-up date/time' }) @IsOptional() @IsDateString() declare nextFollowupDate?: string;
  @ApiPropertyOptional({ description: 'Lead stage database ID' }) @IsOptional() @Type(() => Number) @IsInt() declare leadStageId?: number;
  @ApiPropertyOptional({ description: 'active, junk, or converted' }) @IsOptional() @IsIn(['active', 'junk', 'converted']) declare leadStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare junkNote?: string;
  @ApiPropertyOptional({ description: 'Visit place database ID' }) @IsOptional() @Type(() => Number) @IsInt() declare visitPlaceId?: number;
  @ApiPropertyOptional({ description: 'Visit status database ID' }) @IsOptional() @Type(() => Number) @IsInt() declare visitStatusId?: number;
  @ApiPropertyOptional({ description: 'Conducting user UUID' }) @IsOptional() @IsUUID() declare conductedBy?: string;
}
