import { PartialType } from '@nestjs/swagger';
import { CreateUtilityTicketDto } from './create-utility-ticket.dto';

export class UpdateUtilityTicketDto extends PartialType(CreateUtilityTicketDto) {}

