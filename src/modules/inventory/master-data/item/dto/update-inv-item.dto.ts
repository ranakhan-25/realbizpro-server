import { PartialType } from '@nestjs/swagger';
import { CreateInvItemDto } from './create-inv-item.dto';

export class UpdateInvItemDto extends PartialType(CreateInvItemDto) {}
