/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';

import { CreateLabourWorkBankDto } from './create_labour_work_bank.dto';

export class UpdateLabourWorkBankDto extends PartialType(
  CreateLabourWorkBankDto,
) {}
