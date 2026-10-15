import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class QueryProjectDto extends PaginateDto {
  @IsOptional()
  @IsString()
  declare search?: string;
}
