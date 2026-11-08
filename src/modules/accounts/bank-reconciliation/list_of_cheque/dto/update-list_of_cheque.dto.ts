import { IsOptional, IsString } from 'class-validator';
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateChequeDto } from './create-list_of_cheque.dto';

export class UpdateListOfChequeDto extends PartialType(CreateChequeDto) {  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

}
