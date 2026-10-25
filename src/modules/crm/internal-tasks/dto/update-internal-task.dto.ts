import { PartialType } from '@nestjs/swagger';
import { CreateInternalTaskDto } from './create-internal-task.dto';

export class UpdateInternalTaskDto extends PartialType(CreateInternalTaskDto) {}
