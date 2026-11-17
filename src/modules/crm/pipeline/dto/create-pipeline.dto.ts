import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreatePipelineDto {
  @ApiProperty({ description: 'Existing project UUID selected from the project dropdown' })
  @IsUUID()
  declare projectUuid: string;

  @ApiPropertyOptional({ minimum: 0, default: 0, example: 10 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  declare initialLeadsCount?: number;

  @ApiPropertyOptional({ minimum: 0, default: 0, example: 25000000, description: 'Estimated pipeline value in BDT' })
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  declare estimatedPipelineValue?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @IsInt()
  declare orgId?: number;
}
