import { PartialType } from '@nestjs/swagger';
import { CreateJobLogDto } from './create-job-log.dto';

export class UpdateJobLogDto extends PartialType(
  CreateJobLogDto,
) {}
