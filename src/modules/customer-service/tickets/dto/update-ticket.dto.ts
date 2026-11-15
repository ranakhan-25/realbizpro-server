import { PartialType } from '@nestjs/swagger';
import { CreateServiceTicketDto } from './create-ticket.dto';

export class UpdateServiceTicketDto extends PartialType(CreateServiceTicketDto) {}
