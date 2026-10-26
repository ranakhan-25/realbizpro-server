import { PartialType } from '@nestjs/swagger';
import { CreateCrmPartyDto } from './create-crm-party.dto';
export class UpdateCrmPartyDto extends PartialType(CreateCrmPartyDto) {}
