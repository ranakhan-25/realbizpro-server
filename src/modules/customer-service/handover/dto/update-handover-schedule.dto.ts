import { PartialType } from '@nestjs/swagger';
import { CreateHandoverScheduleDto } from './create-handover-schedule.dto';

export class UpdateHandoverScheduleDto extends PartialType(
  CreateHandoverScheduleDto,
) {}
