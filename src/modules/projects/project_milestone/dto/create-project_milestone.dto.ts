/* eslint-disable prettier/prettier */
import { IsString, IsUUID, IsEnum, IsOptional, IsNumber, IsISO8601, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { MilestoneStatus } from 'src/database/models/projects/project_milestone/pr_project_milestone_model'; // ✅ সঠিক পাথ

export class CreateProjectMilestoneDto {
  @IsUUID()
  projectUuid: string;

  @IsString()
  milestoneCode: string;

  @IsString()
  milestoneName: string;

  @IsISO8601({ strict: true })
  plannedDate: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  actualDate?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  progress?: number;

  @IsEnum(MilestoneStatus)
  @IsOptional()
  status?: MilestoneStatus;

  @IsString()
  @IsOptional()
  varianceDays?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;
}