/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class QueryProjectShareAssignmentDto extends PaginateDto {
  @ApiPropertyOptional({
    description:
      'Search by shareCode, customerName, mobile, nid',
  })

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filter by Project',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filter by ProjectType',
  })
  @IsOptional()
  @IsUUID()
  projectTypeId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filter by Site',
  })
  @IsOptional()
  @IsUUID()
  siteId?: string;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
