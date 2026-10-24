import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CommunicationStatusState } from 'src/database/models/crm/configuration/crm-communication-status.model';

export class QueryCommunicationStatusDto {
  @ApiPropertyOptional({ default: 1, example: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, example: 10 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  skip?: number;

  @ApiPropertyOptional({ example: 'Follow-up' })
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CommunicationStatusState })
  @IsOptional() @IsEnum(CommunicationStatusState)
  status?: CommunicationStatusState;

  @ApiPropertyOptional({ description: 'Filter by lead stage UUID' })
  @IsOptional() @IsString()
  leadStageId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ enum: ['createdAt', 'updatedAt', 'name', 'status'], default: 'createdAt' })
  @IsOptional() @IsIn(['createdAt', 'updatedAt', 'name', 'status'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional() @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ default: false })
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean()
  withDeleted?: boolean = false;
}
