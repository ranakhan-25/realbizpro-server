import { ApiProperty } from '@nestjs/swagger';
import {
  Type,
  Transform,
} from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class SelectCompanyDto {
  @ApiProperty({
    description:
      'ID of the company to select for active session',
    example: 1,
  })
  @Transform(
    ({ value, obj }) =>
      value ?? obj.companyId ?? obj.company_id,
  )
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message:
        'company_id must be a valid number',
    },
  )
  @IsNotEmpty({
    message: 'company_id is required',
  })
  company_id!: number;
}
