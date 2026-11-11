import { PartialType } from '@nestjs/swagger';
import { CreateDueDiligenceDto } from './create-due-diligence.dto';

export class UpdateDueDiligenceDto extends PartialType(CreateDueDiligenceDto) {}
