import { PartialType } from '@nestjs/swagger';
import { CreateSnagDto } from './create-snag.dto';

export class UpdateSnagDto extends PartialType(CreateSnagDto) {}
