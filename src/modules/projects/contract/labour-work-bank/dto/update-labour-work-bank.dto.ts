/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';

import { CreateLabourWorkBankDto } from './create-labour-work-bank.dto';

export class UpdateLabourWorkBankDto extends PartialType(
  CreateLabourWorkBankDto,
) {}
