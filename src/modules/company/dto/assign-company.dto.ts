import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class AssignUserCompaniesDto {
  @ApiProperty({
    description:
      'Target User ID to assign companies to',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber(
    {},
    { message: 'user_id must be a number' },
  )
  @IsNotEmpty({ message: 'user_id is required' })
  user_id!: number;

  @ApiProperty({
    description:
      'List of Company IDs to assign to the user',
    example: [1, 2],
    type: [Number],
  })
  @IsArray({
    message:
      'company_ids must be an array of numbers',
  })
  @IsNumber(
    {},
    {
      each: true,
      message: 'Each company_id must be a number',
    },
  )
  @Type(() => Number)
  company_ids!: number[];
}
