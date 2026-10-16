import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class QueryMaterialRequisitionItemDto extends PaginateDto {
  @ApiPropertyOptional({ example: 'cement' })
  @IsOptional()
  @IsString()
  declare search?: string;
}
