/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';

import { CreateFundRequisitionDto } from './create-fund-requisition.dto';

export class UpdateFundRequisitionDto extends PartialType(
  CreateFundRequisitionDto,
) {}
