import { IsOptional, IsString } from 'class-validator';
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVoucherDto } from './create-received-voucher.dto';

export class UpdateReceivedVoucherDto extends PartialType(CreateVoucherDto) {  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

}
