import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export enum EmployeeKpiType { INDIVIDUAL = 'INDIVIDUAL', TEAM = 'TEAM' }
export enum EmployeeKpiStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }

export class CreateEmployeeKpiDto {
  @ApiProperty({ enum: EmployeeKpiType, example: 'TEAM' })
  @IsEnum(EmployeeKpiType)
  declare type: EmployeeKpiType;

  @ApiProperty({ example: 'Sales Team', description: 'Team name for TEAM; N/A is accepted for INDIVIDUAL' })
  @IsString() @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ description: 'Employee UUID for INDIVIDUAL KPI' })
  @IsOptional() @IsUUID()
  declare userId?: string;

  @ApiPropertyOptional({ description: 'CRM team database ID for TEAM KPI' })
  @IsOptional() @IsInt()
  declare teamId?: number;

  @ApiProperty({ example: 'Call Task' }) @IsString() @MaxLength(100) declare workType1: string;
  @ApiProperty({ example: 10 }) @IsNumber() @Min(0) declare target1: number;
  @ApiProperty({ example: 'Visit Task' }) @IsString() @MaxLength(100) declare workType2: string;
  @ApiProperty({ example: 5 }) @IsNumber() @Min(0) declare target2: number;
  @ApiProperty({ example: 'Sales Task' }) @IsString() @MaxLength(100) declare workType3: string;
  @ApiProperty({ example: 2 }) @IsNumber() @Min(0) declare target3: number;

  @ApiProperty({ example: '2026-07-01' }) @IsDateString() declare fromDate: string;
  @ApiProperty({ example: '2026-07-31' }) @IsDateString() declare toDate: string;
  @ApiPropertyOptional({ enum: EmployeeKpiStatus, default: EmployeeKpiStatus.ACTIVE })
  @IsOptional() @IsEnum(EmployeeKpiStatus) declare status?: EmployeeKpiStatus;
  @ApiPropertyOptional({ description: 'UUID/code of the user creating the record' })
  @IsOptional() @IsString() declare createdBy?: string;
}
