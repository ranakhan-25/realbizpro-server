import { PartialType } from '@nestjs/swagger';
import { CreateUnderDto } from './create-under.dto';

export class UpdateUnderDto extends PartialType(
  CreateUnderDto,
) {}
