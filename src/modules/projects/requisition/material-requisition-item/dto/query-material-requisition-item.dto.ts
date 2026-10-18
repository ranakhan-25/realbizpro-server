import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class QueryMaterialRequisitionItemDto extends PaginateDto {
  @ApiPropertyOptional({
    description:
      'Filter items by parent material requisition UUID',
  })
  @IsOptional()
  @IsUUID()
  declare materialRequisitionId?: string;

  @ApiPropertyOptional({ example: 'cement' })
  @IsOptional()
  @IsString()
  declare search?: string;
}
