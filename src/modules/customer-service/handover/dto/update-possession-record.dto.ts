import { PartialType } from '@nestjs/swagger';
import { CreatePossessionRecordDto } from './create-possession-record.dto';

export class UpdatePossessionRecordDto extends PartialType(
  CreatePossessionRecordDto,
) {}
