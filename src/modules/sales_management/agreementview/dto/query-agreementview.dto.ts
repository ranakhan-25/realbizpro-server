import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AgreementStatus } from '../../../../database/models/sales_management/sm_agreement_view.model';

export class QueryAgreementDto {
  @ApiPropertyOptional({ description: 'Search by buyer / property / code' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: AgreementStatus })
  @IsOptional()
  @IsEnum(AgreementStatus)
  status?: AgreementStatus;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: ['createdAt', 'price', 'date', 'buyer'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'] as any)
  order?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Include soft-deleted records',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  includeDeleted?: boolean = false;
}
