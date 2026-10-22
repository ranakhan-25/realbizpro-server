/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceReconciliationDto } from './create-attendance-reconciliation.dto';

export class UpdateAttendanceReconciliationDto extends PartialType(
  CreateAttendanceReconciliationDto,
) {}
