import { PaginateDto } from 'src/common/dto/paginate.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { FlatLandStatus } from 'src/database/models/projects/flatland/pr_flatland.model';

export class QueryFlatLandDto extends PaginateDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter by related project UUID' }) @IsOptional() @IsUUID() projectId?: string;
  @ApiPropertyOptional({ description: 'Filter by existing site name; FlatLand has no siteId column' }) @IsOptional() @IsString() siteName?: string;
  @ApiPropertyOptional({ enum: FlatLandStatus }) @IsOptional() @IsEnum(FlatLandStatus) status?: FlatLandStatus;
}
