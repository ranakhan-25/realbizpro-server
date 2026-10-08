import { PartialType } from '@nestjs/swagger';
import { CreateInvStockTransferDto } from './create-inv-stock-transfer.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInvStockTransferDto extends PartialType(CreateInvStockTransferDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
