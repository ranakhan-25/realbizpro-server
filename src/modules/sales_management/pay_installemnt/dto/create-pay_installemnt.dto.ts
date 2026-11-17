/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Installment Plan UUID or Code' })
  @IsString()
  planUuid: string;

  @ApiProperty({ description: 'Installment UUID, ID, or Number' })
  @IsString() // ✅ এখানে @IsUUID() এর পরিবর্তে @IsString() দেওয়া হলো
  installmentUuid: string;

  @ApiProperty({ example: 'Bank Transfer' })
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional({ example: 'TXN-CB-8A2F' })
  @IsOptional()
  @IsString()
  transactionId?: string;
}